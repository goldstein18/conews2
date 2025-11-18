import { useEffect, useCallback, useRef } from 'react';
import { useNotificationsStore } from '@/store/notifications-store';
import { isNotificationMessage, isConnectedMessage, SSEMessage } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';

interface UseNotificationSSEProps {
  enabled: boolean;
  token?: string | null;
  onNotificationReceived?: (notification: any) => void;
}

const SSE_BASE_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL?.replace('/graphql', '') || 'http://localhost:3001';
const MAX_RECONNECT_DELAY = 30000; // 30 seconds max delay
const BASE_RECONNECT_DELAY = 1000; // 1 second base delay

export function useNotificationSSE({
  enabled,
  token,
  onNotificationReceived
}: UseNotificationSSEProps) {
  const {
    setSSEConnection,
    setConnected,
    setReconnecting,
    addNotification,
    incrementReconnectAttempts,
    resetReconnectAttempts,
    reconnectAttempts,
  } = useNotificationsStore();

  const { toast } = useToast();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Calculate exponential backoff delay
  const getReconnectDelay = useCallback(() => {
    const delay = Math.min(
      BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttempts),
      MAX_RECONNECT_DELAY
    );
    return delay;
  }, [reconnectAttempts]);

  // Disconnect function
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      console.log('🔌 Disconnecting SSE...');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setSSEConnection(null);
      setConnected(false);
    }
  }, [setSSEConnection, setConnected]);

  // Connect function
  const connect = useCallback(() => {
    if (!enabled || !token) {
      disconnect();
      return;
    }

    // Don't reconnect if already connected
    if (eventSourceRef.current) {
      return;
    }

    try {
      console.log('🔌 Connecting to SSE stream...');
      const url = `${SSE_BASE_URL}/notifications/stream?token=${token}`;
      const eventSource = new EventSource(url);

      eventSourceRef.current = eventSource;
      setSSEConnection(eventSource);

      // Handle messages
      eventSource.onmessage = (event) => {
        try {
          const data: SSEMessage = JSON.parse(event.data);

          if (isConnectedMessage(data)) {
            console.log('✅ Connected to notification stream');
            setConnected(true);
            setReconnecting(false);
            resetReconnectAttempts();
          } else if (isNotificationMessage(data)) {
            console.log('📬 Received notification:', data.title);

            // Add to store
            addNotification(data);

            // Show toast notification
            toast({
              title: data.title,
              description: data.message,
              duration: 5000,
            });

            // Call custom callback if provided
            if (onNotificationReceived) {
              onNotificationReceived(data);
            }
          }
        } catch (error) {
          console.error('❌ Error parsing SSE message:', error);
        }
      };

      // Handle errors
      eventSource.onerror = (error) => {
        console.error('❌ SSE error:', error);
        setConnected(false);

        // Close current connection
        eventSource.close();
        eventSourceRef.current = null;
        setSSEConnection(null);

        // Attempt reconnect with exponential backoff
        if (enabled && token) {
          setReconnecting(true);
          incrementReconnectAttempts();

          const delay = getReconnectDelay();
          console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttempts + 1})...`);

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      // Handle connection open
      eventSource.onopen = () => {
        console.log('🔓 SSE connection opened');
      };

    } catch (error) {
      console.error('❌ Error creating EventSource:', error);
      setConnected(false);
    }
  }, [
    enabled,
    token,
    disconnect,
    setSSEConnection,
    setConnected,
    setReconnecting,
    addNotification,
    onNotificationReceived,
    incrementReconnectAttempts,
    resetReconnectAttempts,
    getReconnectDelay,
    reconnectAttempts,
  ]);

  // Effect to manage connection
  useEffect(() => {
    if (enabled && token) {
      connect();
    } else {
      disconnect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [enabled, token, connect, disconnect]);

  return {
    disconnect,
    reconnect: () => {
      disconnect();
      setTimeout(() => connect(), 100);
    },
  };
}
