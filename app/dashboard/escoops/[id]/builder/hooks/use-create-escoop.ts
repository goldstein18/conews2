import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { CREATE_ESCOOP, type CreateEscoopVariables, type CreateEscoopData } from '@/lib/graphql/escoops';
import { useEscoopBuilderStore } from '@/store/escoop-builder-store';
import type { ApolloError } from '@apollo/client';

interface UseCreateEscoopProps {
  escoopData?: {
    name: string;
    title?: string;
    sendDate?: string;
    remaining?: number;
    bannersRemaining?: number;
    market?: string;
    locations?: string[];
  };
}

interface UseCreateEscoopReturn {
  createEscoop: () => Promise<boolean>;
  loading: boolean;
  error: ApolloError | undefined;
}

export function useCreateEscoop({ escoopData }: UseCreateEscoopProps): UseCreateEscoopReturn {
  const {
    selectedRestaurants,
    selectedFeaturedEvents,
    settings
  } = useEscoopBuilderStore();

  const [createEscoopMutation, { loading, error }] = useMutation<CreateEscoopData, CreateEscoopVariables>(
    CREATE_ESCOOP,
    {
      onCompleted: (data) => {
        if (data.createEscoop) {
          toast.success('eScoop saved successfully!');
          console.log('eScoop created:', data.createEscoop);
        }
      },
      onError: (error) => {
        console.error('Error creating eScoop:', error);
        toast.error('Failed to save eScoop: ' + error.message);
      }
    }
  );

  const createEscoop = async (): Promise<boolean> => {
    try {
      if (!escoopData) {
        toast.error('Missing escoop data');
        return false;
      }

      // Prepare restaurant IDs (only selected ones)
      const restaurantIds = selectedRestaurants
        .filter(restaurant => restaurant.isSelected)
        .map(restaurant => restaurant.id);

      // Prepare featured event IDs (only selected ones)
      const featuredEventIds = selectedFeaturedEvents
        .filter(event => event.isSelected)
        .map(event => event.id);

      // Prepare the input data
      const createEscoopInput = {
        // ✅ Campos requeridos
        name: escoopData.name || 'Test Newsletter',
        title: escoopData.title || settings.subjectLine || 'Test Title',
        sendDate: escoopData.sendDate || new Date().toISOString(),

        // ✅ Campos opcionales
        market: escoopData.market || 'miami',
        ...(escoopData.remaining && { remaining: escoopData.remaining }),
        ...(escoopData.bannersRemaining && { bannersRemaining: escoopData.bannersRemaining }),
        ...(escoopData.locations && escoopData.locations.length > 0 && { locations: escoopData.locations }),

        // ✅ Arrays de IDs (solo si tienen elementos)
        ...(restaurantIds.length > 0 && { restaurantIds }),
        ...(featuredEventIds.length > 0 && { featuredEventIds }),

        // ✅ Settings configuration (campos requeridos)
        settings: {
          subjectLine: settings.subjectLine || '🎭 Cultural Events This Week', // ✅ REQUERIDO
          templateName: settings.selectedTemplate || 'miami-weekly-template',    // ✅ REQUERIDO
          sendNow: false,
          scheduleDate: settings.scheduledDate
            ? settings.scheduledDate.toISOString().split('T')[0]               // ✅ Formato YYYY-MM-DD
            : new Date().toISOString().split('T')[0],
          scheduleTime: settings.scheduledDate
            ? settings.scheduledDate.toISOString().split('T')[1]?.substring(0, 5) // ✅ Formato HH:mm
            : '10:00',
          timezone: 'America/New_York'
          // Removidos campos opcionales que causan errores de validación
        }
      };

      console.log('Creating eScoop with data:', createEscoopInput);

      const result = await createEscoopMutation({
        variables: {
          createEscoopInput
        }
      });

      if (result.data?.createEscoop) {
        // Optional: Navigate back to escoops list or to the created escoop
        // router.push('/dashboard/escoops');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error in createEscoop:', error);
      return false;
    }
  };

  return {
    createEscoop,
    loading,
    error
  };
}