'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Edit2, Trash2, GripVertical, Plus } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AddAgendaItemDialog } from './add-agenda-item-dialog';
import { type AgendaItemFormData } from '../../lib/validations';

interface EventAgendaPanelProps {
  agendaItems: Array<AgendaItemFormData & { id: string; orderIndex: number }>;
  onUpdateAgenda: (items: Array<AgendaItemFormData & { id: string; orderIndex: number }>) => void;
  disabled?: boolean;
}

interface SortableAgendaItemProps {
  item: AgendaItemFormData & { id: string; orderIndex: number };
  onEdit: (item: AgendaItemFormData & { id: string; orderIndex: number }) => void;
  onDelete: (id: string) => void;
}

function SortableAgendaItem({ item, onEdit, onDelete }: SortableAgendaItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Helper function to format time
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // If it's already in HH:MM format, return as is
    if (timeString.match(/^\d{2}:\d{2}$/)) {
      return timeString;
    }
    // If it's an ISO string, extract time
    try {
      const date = new Date(timeString);
      return date.toTimeString().slice(0, 5);
    } catch {
      return timeString;
    }
  };

  // Helper function to format duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group"
    >
      <Card className="border-l-4 border-l-primary/20 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors pt-1"
            >
              <GripVertical className="h-5 w-5" />
            </div>

            {/* Time Badge */}
            <div className="flex-shrink-0 bg-primary/10 text-primary px-3 py-2 rounded-lg text-center min-w-[80px]">
              <div className="text-sm font-semibold">{formatTime(item.startTime)}</div>
              <div className="text-xs text-muted-foreground">{formatDuration(item.duration)}</div>
            </div>

            {/* Agenda Item Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Duration: {formatDuration(item.duration)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EventAgendaPanel({ agendaItems, onUpdateAgenda, disabled }: EventAgendaPanelProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<
    (AgendaItemFormData & { id: string; orderIndex: number }) | null
  >(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = agendaItems.findIndex((item) => item.id === active.id);
      const newIndex = agendaItems.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(agendaItems, oldIndex, newIndex).map((item, index) => ({
        ...item,
        orderIndex: index,
      }));

      onUpdateAgenda(newItems);
    }
  };

  const handleAddItem = (itemData: AgendaItemFormData) => {
    const newItem = {
      ...itemData,
      id: `agenda-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orderIndex: agendaItems.length,
    };

    onUpdateAgenda([...agendaItems, newItem]);
  };

  const handleEditItem = (itemData: AgendaItemFormData) => {
    if (!editingItem) return;

    const updatedItems = agendaItems.map((item) =>
      item.id === editingItem.id
        ? { ...itemData, id: editingItem.id, orderIndex: editingItem.orderIndex }
        : item
    );

    onUpdateAgenda(updatedItems);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = agendaItems
      .filter((item) => item.id !== id)
      .map((item, index) => ({
        ...item,
        orderIndex: index,
      }));

    onUpdateAgenda(updatedItems);
  };

  const handleEditClick = (item: AgendaItemFormData & { id: string; orderIndex: number }) => {
    setEditingItem(item);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Agenda</h3>
        </div>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowAddDialog(true);
          }}
          disabled={disabled}
          size="sm"
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </Button>
      </div>

      {/* Agenda Items List */}
      {agendaItems.length > 0 ? (
        <div className="space-y-4">
          {/* Timeline visualization */}
          <div className="hidden md:block text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Drag items to reorder the schedule</span>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={agendaItems.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {agendaItems.map((item) => (
                  <SortableAgendaItem
                    key={item.id}
                    item={item}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Schedule Summary */}
          {agendaItems.length > 1 && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Schedule Overview</h4>
              <div className="text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Sessions:</span>
                  <span className="font-medium">{agendaItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Duration:</span>
                  <span className="font-medium">
                    {(() => {
                      const totalMinutes = agendaItems.reduce((sum, item) => sum + item.duration, 0);
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;
                      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
                    })()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No agenda items yet</h4>
            <p className="text-gray-500 mb-4">
              Create a schedule to help attendees plan their time and know what to expect.
            </p>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAddDialog(true);
              }}
              disabled={disabled}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Session
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Agenda Item Dialog */}
      <AddAgendaItemDialog
        open={showAddDialog || editingItem !== null}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false);
            setEditingItem(null);
          }
        }}
        onAddAgendaItem={editingItem ? handleEditItem : handleAddItem}
        existingItem={editingItem || undefined}
        mode={editingItem ? 'edit' : 'add'}
      />
    </div>
  );
}