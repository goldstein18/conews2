import React, { useRef, useState, useEffect, ReactNode, MouseEventHandler, UIEvent } from 'react';
import { motion, useInView } from 'motion/react';
import { EscoopBuilderEntry } from '@/store/escoop-builder-store';
import Image from 'next/image';

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="mb-4 cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

interface AnimatedEventsListProps {
  events?: EscoopBuilderEntry[];
  onEventSelect?: (event: EscoopBuilderEntry, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
}

const AnimatedEventsList: React.FC<AnimatedEventsListProps> = ({
  events = [],
  onEventSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.min(prev + 1, events.length - 1));
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < events.length) {
          e.preventDefault();
          if (onEventSelect) {
            onEventSelect(events[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [events, selectedIndex, onEventSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement | null;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: 'smooth'
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  const handleEventClick = (event: EscoopBuilderEntry, index: number) => {
    // Navigate to event edit page
    const eventEditUrl = `/dashboard/events/${event.event.id}/edit`;
    window.open(eventEditUrl, '_blank');

    // Also call onEventSelect if provided
    if (onEventSelect) {
      onEventSelect(event, index);
    }
  };

  if (events.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <div className="text-center">
            <p className="text-sm">No events found for this newsletter</p>
            <p className="text-xs mt-1">Events will appear here automatically when added to the escoop</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={listRef}
        className={`max-h-[280px] overflow-y-auto ${
          displayScrollbar
            ? '[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb:hover]:bg-gray-400'
            : 'scrollbar-hide'
        }`}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: displayScrollbar ? 'thin' : 'none',
          scrollbarColor: '#d1d5db #f3f4f6'
        }}
      >
        {events.map((event, index) => (
          <AnimatedItem
            key={event.id}
            delay={0.05}
            index={index}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => handleEventClick(event, index)}
          >
            <div className={`p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 ${
              selectedIndex === index ? 'border-blue-500 bg-blue-50 shadow-sm' : ''
            } ${itemClassName}`}>
              <div className="flex items-center space-x-3">
                {/* Event Image */}
                {event.event.mainImageUrl ? (
                  <Image
                    src={event.event.mainImageUrl}
                    alt={event.event.title}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-xs">📅</span>
                  </div>
                )}

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate hover:text-blue-600 transition-colors">
                    {event.event.title}
                  </h4>
                  {event.event.startDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      📅 {new Date(event.event.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </AnimatedItem>
        ))}
      </div>
      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[30px] bg-gradient-to-b from-white to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: topGradientOpacity }}
          ></div>
          <div
            className="absolute bottom-0 left-0 right-0 h-[50px] bg-gradient-to-t from-white to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: bottomGradientOpacity }}
          ></div>
        </>
      )}
    </div>
  );
};

export default AnimatedEventsList;