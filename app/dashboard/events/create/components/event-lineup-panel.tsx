'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, User, Users, Edit2, Trash2, GripVertical, Plus } from 'lucide-react';
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
import { AddPerformerDialog } from './add-performer-dialog';
import { type PerformerFormData } from '../../lib/validations';

interface EventLineupPanelProps {
  performers: Array<PerformerFormData & { id: string; orderIndex: number }>;
  onUpdateLineup: (performers: Array<PerformerFormData & { id: string; orderIndex: number }>) => void;
  disabled?: boolean;
}

interface SortablePerformerItemProps {
  performer: PerformerFormData & { id: string; orderIndex: number };
  onEdit: (performer: PerformerFormData & { id: string; orderIndex: number }) => void;
  onDelete: (id: string) => void;
}

function SortablePerformerItem({ performer, onEdit, onDelete }: SortablePerformerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: performer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ARTIST':
        return <Mic className="h-4 w-4" />;
      case 'SPEAKER':
        return <User className="h-4 w-4" />;
      case 'GUEST':
        return <Users className="h-4 w-4" />;
      default:
        return <Mic className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ARTIST':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'SPEAKER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'GUEST':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
          <div className="flex items-center space-x-4">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
            >
              <GripVertical className="h-5 w-5" />
            </div>

            {/* Profile Image Placeholder */}
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6 text-gray-400" />
            </div>

            {/* Performer Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-gray-900 truncate">{performer.name}</h4>
                <span
                  className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                    performer.type
                  )}`}
                >
                  {getTypeIcon(performer.type)}
                  <span>{performer.type}</span>
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium">{performer.role}</p>
              {performer.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{performer.description}</p>
              )}
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
                  onEdit(performer);
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
                  onDelete(performer.id);
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

export function EventLineupPanel({ performers, onUpdateLineup, disabled }: EventLineupPanelProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPerformer, setEditingPerformer] = useState<
    (PerformerFormData & { id: string; orderIndex: number }) | null
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
      const oldIndex = performers.findIndex((p) => p.id === active.id);
      const newIndex = performers.findIndex((p) => p.id === over.id);

      const newPerformers = arrayMove(performers, oldIndex, newIndex).map((performer, index) => ({
        ...performer,
        orderIndex: index,
      }));

      onUpdateLineup(newPerformers);
    }
  };

  const handleAddPerformer = (performerData: PerformerFormData) => {
    const newPerformer = {
      ...performerData,
      id: `performer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orderIndex: performers.length,
    };

    onUpdateLineup([...performers, newPerformer]);
  };

  const handleEditPerformer = (performerData: PerformerFormData) => {
    if (!editingPerformer) return;

    const updatedPerformers = performers.map((p) =>
      p.id === editingPerformer.id
        ? { ...performerData, id: editingPerformer.id, orderIndex: editingPerformer.orderIndex }
        : p
    );

    onUpdateLineup(updatedPerformers);
    setEditingPerformer(null);
  };

  const handleDeletePerformer = (id: string) => {
    const updatedPerformers = performers
      .filter((p) => p.id !== id)
      .map((performer, index) => ({
        ...performer,
        orderIndex: index,
      }));

    onUpdateLineup(updatedPerformers);
  };

  const handleEditClick = (performer: PerformerFormData & { id: string; orderIndex: number }) => {
    setEditingPerformer(performer);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Lineup</h3>
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
          <span>Add Artist</span>
        </Button>
      </div>

      {/* Performers List */}
      {performers.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={performers.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {performers.map((performer) => (
                <SortablePerformerItem
                  key={performer.id}
                  performer={performer}
                  onEdit={handleEditClick}
                  onDelete={handleDeletePerformer}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No performers added yet</h4>
            <p className="text-gray-500 mb-4">
              Add performers and schedule details to help attendees know what to expect.
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
              Add Your First Performer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Performer Dialog */}
      <AddPerformerDialog
        open={showAddDialog || editingPerformer !== null}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false);
            setEditingPerformer(null);
          }
        }}
        onAddPerformer={editingPerformer ? handleEditPerformer : handleAddPerformer}
        existingPerformer={editingPerformer || undefined}
        mode={editingPerformer ? 'edit' : 'add'}
      />
    </div>
  );
}