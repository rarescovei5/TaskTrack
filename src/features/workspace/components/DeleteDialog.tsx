import { useAppDispatch } from '@/app/hooks';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash } from 'lucide-react';
import React from 'react';
import { cascadeRemoveWorkspace } from '../slices/workspacesSlice';
import { cascadeRemoveBoard } from '../slices/boardsSlice';
import { cascadeRemoveColumn } from '../slices/columnsSlice';
import { removeTaskFromAll } from '../slices/tasksSlice';

type DeleteDialogProps =
  | { objectType: 'workspace'; workspaceId: string }
  | { objectType: 'board'; boardId: string; workspaceId: string }
  | { objectType: 'column'; columnId: string; boardId: string }
  | { objectType: 'task'; taskId: string; columnId: string };

function DeleteDialog(props: DeleteDialogProps) {
  const dispatch = useAppDispatch();

  const handleDelete = React.useCallback(() => {
    switch (props.objectType) {
      case 'workspace':
        dispatch(cascadeRemoveWorkspace({ workspaceId: props.workspaceId }));
        break;
      case 'board':
        dispatch(
          cascadeRemoveBoard({ workspaceId: props.workspaceId, boardId: props.boardId })
        );
        break;
      case 'column':
        dispatch(
          cascadeRemoveColumn({ boardId: props.boardId, columnId: props.columnId })
        );
        break;
      case 'task':
        dispatch(removeTaskFromAll({ columnId: props.columnId, taskId: props.taskId }));
        break;
    }
  }, [props]);

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer px-4 py-3 border rounded-md bg-red-500 hover:bg-red-500/75 active:bg-red-500/50 transition-colors duration-300 text-white flex gap-2 items-center">
        <Trash size={16} />
        Delete
      </DialogTrigger>

      <DialogContent className="flex flex-col justify-between">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the item with no
            way of getting it back.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2 mt-auto">
          <DialogClose className="cursor-pointer px-4 py-2 border rounded-md">
            Cancel
          </DialogClose>
          <button
            className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            onClick={handleDelete}
          >
            Yes, I'm sure
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default DeleteDialog;
