import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"

import { useCallback, useState } from "react";
import { Task, TaskStatus } from "../types";
import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanCard } from "./kanban-card";

interface DataKanbanProps {
  data: Task[]
  onChange: (tasks: { $id: string, status: TaskStatus, position: number }[]) => void
}

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE
]

type TasksState = {
  [key in TaskStatus]: Task[]
}

export const DataKanban = ({
  data,
  onChange
}: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: []
    }

    data.forEach(task => {
      initialTasks[task.status].push(task)
    })

    Object.keys(initialTasks).forEach(status => {
      initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position)
    })

    return initialTasks;
  });

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;
    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    let updatePayload: { $id: string, status: TaskStatus, position: number }[] = [];

    setTasks((prev) => {
      const newTasks = { ...prev };

      const sourceColumn = [...newTasks[sourceStatus]];
      const [movedTask] = sourceColumn.splice(source.index, 1);

      if (!movedTask) {
        console.error("Task not found");
        return prev;
      }

      const updatedMoveTasks = sourceStatus !== destinationStatus
        ? { ...movedTask, status: destinationStatus }
        : movedTask;

      newTasks[sourceStatus] = sourceColumn;

      const destColumn = [...newTasks[destinationStatus]];

      destColumn.splice(destination.index, 0, updatedMoveTasks);
      newTasks[destinationStatus] = destColumn;

      updatePayload.push({
        $id: updatedMoveTasks.$id,
        status: destinationStatus,
        position: Math.min((destination.index + 1) * 1000, 1_000_000)
      })

      newTasks[destinationStatus].forEach((task, index) => {
        if (task && task.$id !== updatedMoveTasks.$id) {
          const newPosition = Math.min((index + 1) * 1000, 1_000_000);
          if (task.position !== newPosition) {
            updatePayload.push({
              $id: task.$id,
              status: destinationStatus,
              position: newPosition
            })
          }
        }
      })

      if (sourceStatus === destinationStatus) {
        newTasks[destinationStatus].forEach((task, index) => {
          if (task) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if (task.position !== newPosition) {
              updatePayload.push({
                $id: task.$id,
                status: destinationStatus,
                position: newPosition
              })
            }
          }
        })
      }

      return newTasks;
    })

    onChange(updatePayload);
  }, [onChange])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div key={board} className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]">
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.$id}
                        draggableId={task.$id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
