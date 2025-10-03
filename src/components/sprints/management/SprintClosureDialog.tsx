
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Story {
  id: string;
  title: string;
  status: 'to_do' | 'in_progress' | 'qa' | 'done';
}

interface SprintClosureDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSubmitComplete: () => void;
  todoStories: Story[];
  inProgressStories: Story[];
  qaStories: Story[];
  isCompleteSprint: boolean;
}

export const SprintClosureDialog: React.FC<SprintClosureDialogProps> = ({
  open,
  onClose,
  onConfirm,
  todoStories,
  inProgressStories,
  qaStories,
}) => {
  const hasBlockingStories = inProgressStories.length > 0 || qaStories.length > 0;
  const hasTodoStories = todoStories.length > 0;

  // if (isCompleteSprint) {
  //   return (
  //     <AlertDialog open={open} onOpenChange={onClose}>
  //       <AlertDialogContent>
  //         <AlertDialogHeader>
  //           <AlertDialogTitle>Complete Sprint?</AlertDialogTitle>
  //           <AlertDialogDescription>
  //             Are you sure you want to complete this sprint? This action cannot be undone.
  //           </AlertDialogDescription>
  //         </AlertDialogHeader>
  //         <AlertDialogFooter>
  //           <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
  //           <AlertDialogAction onClick={() => onSubmitComplete()}>
  //             Complete Sprint
  //           </AlertDialogAction>
  //           </AlertDialogFooter>
  //       </AlertDialogContent>
  //     </AlertDialog>
  //   );
  // }
  if (hasBlockingStories) {
    return (
      <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cannot Close Sprint</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>This sprint cannot be closed because there are stories that are still in progress or in QA.</p>
              
              {inProgressStories.length > 0 && (
                <div>
                  <p className="font-semibold text-orange-600 mb-2">Stories in Progress ({inProgressStories.length}):</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {inProgressStories.map(story => (
                      <li key={story.id} className="text-sm">{story.title}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {qaStories.length > 0 && (
                <div>
                  <p className="font-semibold text-blue-600 mb-2">Stories in QA ({qaStories.length}):</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {qaStories.map(story => (
                      <li key={story.id} className="text-sm">{story.title}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <p className="text-sm text-gray-600 mt-3">
                Please complete or move these stories before closing the sprint.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onClose}>
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (hasTodoStories) {
    return (
      <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move Stories to Backlog?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>This sprint has {todoStories.length} story(ies) that are still in "To Do" status.</p>
              
              <div>
                <p className="font-semibold text-gray-600 mb-2">Stories to be moved back to backlog:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {todoStories.map(story => (
                    <li key={story.id} className="text-sm">{story.title}</li>
                  ))}
                </ul>
              </div>
              
              <p className="text-sm text-gray-600">
                Do you want to move these stories back to the backlog and close the sprint?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>
              Yes, Move to Backlog & Close Sprint
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }


  // No blocking issues, proceed with normal closure
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Close Sprint?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to close this sprint? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Close Sprint
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
