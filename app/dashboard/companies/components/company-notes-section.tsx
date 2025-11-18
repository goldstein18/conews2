"use client";

import { useState } from "react";
import { Save, Edit2, Check, X } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCompanyNotes } from "@/app/dashboard/companies/hooks";

interface CompanyNotesSectionProps {
  companyId: string;
}

export function CompanyNotesSection({ companyId }: CompanyNotesSectionProps) {
  const [currentNote, setCurrentNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  
  const { notes, loading, addingNote, updatingNotes, addNote, updateNotes } = useCompanyNotes({ companyId });

  const handleSaveNote = async () => {
    if (!currentNote.trim()) return;
    
    const success = await addNote({
      note: currentNote.trim()
    });
    
    if (success) {
      setCurrentNote(""); // Clear the textarea after successful save
    }
  };

  const formatDisplayDate = (dateString: string) => {
    // Convert YYYY-MM-DD to more readable format like "2024-01-15 10:30 AM"
    const date = new Date(dateString + 'T10:30:00'); // Add time for display
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    }) + ' 10:30 AM';
  };

  const handleEditNote = (noteId: string, content: string) => {
    setEditingNoteId(noteId);
    setEditingContent(content);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingContent("");
  };

  const handleSaveEdit = async () => {
    if (!editingContent.trim()) return;
    
    // Find the note being edited
    const noteIndex = notes.findIndex(note => note.id === editingNoteId);
    if (noteIndex === -1) return;

    // Rebuild the notes string with the updated content
    const updatedNotes = [...notes];
    updatedNotes[noteIndex] = { ...updatedNotes[noteIndex], content: editingContent.trim() };
    
    // Convert back to the API format
    const newNotesString = updatedNotes
      .map(note => `${note.content}\n\n${note.author} ${note.createdAt}`)
      .join('\n\n');

    const success = await updateNotes(newNotesString);
    
    if (success) {
      setEditingNoteId(null);
      setEditingContent("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <CardDescription>
          Internal notes about this member account for team review
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Note Input */}
        <div className="space-y-4">
          <Textarea
            placeholder="Add internal notes about this company (payment history, special requirements, etc.)"
            rows={4}
            className="resize-none"
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
          />
          
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSaveNote}
              disabled={addingNote || !currentNote.trim()}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              <span>{addingNote ? 'Saving...' : 'Save Note'}</span>
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="text-muted-foreground">Loading notes...</div>
          </div>
        )}

        {/* Previous Notes */}
        {!loading && notes && notes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Previous Notes</h3>
            
            <div className="space-y-4">
              {notes.map((note) => (
                <div 
                  key={note.id} 
                  className="border rounded-lg p-4 bg-gray-50 relative"
                >
                  {/* Edit button in top-right corner */}
                  {editingNoteId !== note.id && (
                    <button
                      onClick={() => handleEditNote(note.id, note.content)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={updatingNotes}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}

                  {/* Note content - editable or display mode */}
                  {editingNoteId === note.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                          disabled={updatingNotes}
                          className="flex items-center space-x-1"
                        >
                          <X className="h-3 w-3" />
                          <span>Cancel</span>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleSaveEdit}
                          disabled={updatingNotes || !editingContent.trim()}
                          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Check className="h-3 w-3" />
                          <span>{updatingNotes ? 'Saving...' : 'Save'}</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-900 mb-3 pr-8">
                        {note.content}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{note.author}</span>
                        <span>{formatDisplayDate(note.createdAt)}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Notes State */}
        {!loading && notes && notes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No previous notes found. Add your first note above.
          </div>
        )}
      </CardContent>
    </Card>
  );
}