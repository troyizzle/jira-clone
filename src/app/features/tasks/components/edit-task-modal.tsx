"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";
import { EditTaskModalWrapper } from "./edit-task-modal-wrapper";

export const EditTaskModal = () => {
  const { taskId, close } = useEditTaskModal();

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && (
        <EditTaskModalWrapper id={taskId} onCancel={close} />
      )}
    </ResponsiveModal>
  )
}
