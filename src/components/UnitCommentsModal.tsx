import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Comment, Unit } from '@/types';
import { ScrollArea } from "@/components/ui/scroll-area";

interface UnitCommentsModalProps {
  unit: Unit | null;
  comments: Comment[];
  isOpen: boolean;
  onClose: () => void;
}

export const UnitCommentsModal: React.FC<UnitCommentsModalProps> = ({ unit, comments, isOpen, onClose }) => {
  if (!unit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Feedback for {unit.code}</DialogTitle>
          <DialogDescription>{unit.name}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] -mx-6 px-6">
          <div className="space-y-4 py-4">
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} className="p-4 rounded-lg bg-gray-100 border border-gray-200">
                  <div className="flex items-start gap-3">
                    {comment.authorAvatar && <img src={comment.authorAvatar} alt={comment.author} className="h-10 w-10 rounded-full" />}
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">{comment.author}</p>
                      <p className="text-xs text-gray-500 mb-2">{comment.createdAt.toLocaleString()}</p>
                      <p className="text-sm text-gray-700">{comment.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 py-8">No feedback has been provided for this unit yet.</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};