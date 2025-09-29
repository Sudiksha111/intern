import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/types/notes';
import Navbar from '@/components/layout/Navbar';
import NoteCard from '@/components/notes/NoteCard';
import NoteEditor from '@/components/notes/NoteEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Plus, BookOpen, Crown, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Notes = () => {
  const { user } = useAuth();
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleCreateNote = () => {
    setEditingNote(undefined);
    setIsEditing(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditing(true);
  };

  const handleSaveNote = async (data: any) => {
    try {
      if (editingNote) {
        await updateNote(editingNote.id, data);
        toast({
          title: "Note updated",
          description: "Your note has been saved successfully.",
        });
      } else {
        await createNote(data);
        toast({
          title: "Note created",
          description: "Your new note has been added.",
        });
      }
      setIsEditing(false);
      setEditingNote(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save note",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      toast({
        title: "Note deleted",
        description: "The note has been removed.",
      });
      setDeleteConfirm(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  const usagePercentage = (notes.length / user.noteLimit) * 100;
  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = notes.length >= user.noteLimit;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <span>Your Notes</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your {user.tenantName} workspace notes
              </p>
            </div>
            
            <Button 
              onClick={handleCreateNote}
              variant="hero"
              disabled={isAtLimit}
              className="shadow-glow"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>

          {/* Usage Stats */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Notes Used</span>
                  <Badge variant={isAtLimit ? "destructive" : isNearLimit ? "outline" : "secondary"}>
                    {notes.length} / {user.noteLimit}
                  </Badge>
                </div>
                {user.subscription === 'free' && user.role === 'admin' && (
                  <Badge variant="outline" className="text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Upgrade for unlimited notes
                  </Badge>
                )}
              </div>
              <Progress 
                value={usagePercentage} 
                className={`h-2 ${isAtLimit ? 'bg-destructive/20' : isNearLimit ? 'bg-orange-100' : ''}`}
              />
              {isAtLimit && (
                <p className="text-xs text-destructive mt-2">
                  Note limit reached. {user.role === 'admin' ? 'Upgrade your plan to add more notes.' : 'Contact your admin to upgrade.'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="max-w-2xl mx-auto">
            <NoteEditor
              note={editingNote}
              onSave={handleSaveNote}
              onCancel={() => {
                setIsEditing(false);
                setEditingNote(undefined);
              }}
              loading={loading}
            />
          </div>
        ) : (
          <>
            {notes.length === 0 ? (
              <Card className="text-center p-12 bg-card/30 backdrop-blur-sm border-border/50">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No notes yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start writing your first note to organize your thoughts and ideas.
                </p>
                <Button 
                  onClick={handleCreateNote}
                  variant="default"
                  disabled={isAtLimit}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Note
                </Button>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={(id) => setDeleteConfirm(id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Note</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this note? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteConfirm && handleDeleteNote(deleteConfirm)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Notes;