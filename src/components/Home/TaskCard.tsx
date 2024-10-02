import React, { FC, useState } from "react";
import { ITask, IUpdateTask } from "../../types";
import EditTask from "../Modals/EditTask";

interface TaskCardProps {
  task: ITask;
  onDelete: (id: string) => void;
  onEdit: (task: IUpdateTask) => void;
}
const TaskCard: FC<TaskCardProps> = ({ task, onDelete, onEdit }) => {
  const [openEditTask, setOpenEditTask] = useState(false);
  return (
    <>
      {openEditTask ? (
        <EditTask
          setOpenEditTask={setOpenEditTask}
          task={task}
          onSubmit={onEdit}
        />
      ) : null}
      <div key={task._id} className="p-4 border rounded-md shadow">
        <h3 className="font-bold text-lg">{task.title}</h3>
        <p>{task.description}</p>
        <p className={`text-sm"text-gray-500"`}>
          Status:{" "}
          <span
            className={`text-sm ${
              task.status === "completed"
                ? "text-green-500"
                : task.status === "in-progress"
                ? "text-blue-600"
                : task.status === "pending"
                ? "text-orange-600"
                : "text-gray-500"
            } `}
          >
            {task.status}
          </span>
        </p>
        <div className="flex justify-between mt-2">
          <button
            onClick={() => setOpenEditTask(!openEditTask)}
            className="text-blue-500"
          >
            Edit
          </button>
          <button onClick={() => onDelete(task._id)} className="text-red-500">
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
