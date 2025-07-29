import React, { useState } from "react";
import { TaskGroupInList, TaskDifficulty, SubTask } from "../types";
import { UNLOCK_LEVELS } from "../constants";
import CheckIcon from "./icons/CheckIcon";
import PencilIcon from "./icons/PencilIcon";
import TrashIcon from "./icons/TrashIcon";

const difficultyColors: Record<TaskDifficulty, string> = {
  [TaskDifficulty.Easy]:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30",
  [TaskDifficulty.Medium]:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/30",
  [TaskDifficulty.Hard]:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30",
};

interface TaskGroupListItemProps {
  group: TaskGroupInList;
  userLevel: number;
  onCompleteSubTask: (
    groupId: string,
    subTaskId: string,
    difficulty: TaskDifficulty
  ) => void;
  onDeleteGroup: (groupId: string) => void;
  onEditSubTask: (groupId: string, subTaskId: string, newName: string) => void;
  onDeleteSubTask: (groupId: string, subTaskId: string) => void;
}

const TaskGroupListItem: React.FC<TaskGroupListItemProps> = ({
  group,
  userLevel,
  onCompleteSubTask,
  onDeleteGroup,
  onEditSubTask,
  onDeleteSubTask,
}) => {
  const [editingSubTaskId, setEditingSubTaskId] = useState<string | null>(null);
  const [editedSubTaskName, setEditedSubTaskName] = useState("");

  const canEdit = userLevel >= UNLOCK_LEVELS.EDIT_TASK;
  const canDelete = userLevel >= UNLOCK_LEVELS.DELETE_TASK;

  const handleStartEdit = (subTask: SubTask) => {
    setEditingSubTaskId(subTask.id);
    setEditedSubTaskName(subTask.name);
  };

  const handleCancelEdit = () => {
    setEditingSubTaskId(null);
    setEditedSubTaskName("");
  };

  const handleSaveEdit = () => {
    if (editingSubTaskId && editedSubTaskName.trim()) {
      onEditSubTask(group.id, editingSubTaskId, editedSubTaskName.trim());
    }
    handleCancelEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md dark:shadow-none border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
        <h3 className="text-lg font-bold text-cyan-700 dark:text-cyan-400">
          {group.name}
        </h3>
        {canDelete && (
          <button
            onClick={() => onDeleteGroup(group.id)}
            title="Usuń całą grupę"
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="space-y-2">
        {group.subTasks &&
          group.subTasks.map((subTask) => {
            if (editingSubTaskId === subTask.id) {
              return (
                <div
                  key={subTask.id}
                  className="bg-slate-200 dark:bg-slate-700 p-2 rounded-lg flex items-center justify-between gap-2 ring-1 ring-cyan-500"
                >
                  <input
                    type="text"
                    value={editedSubTaskName}
                    onChange={(e) => setEditedSubTaskName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow bg-slate-100 dark:bg-slate-600 text-slate-800 dark:text-white placeholder-slate-400 border border-slate-300 dark:border-slate-500 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
                    autoFocus
                  />
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={handleSaveEdit}
                      className="p-1 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/20 rounded-full transition-colors"
                      title="Zapisz"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 rounded-full transition-colors"
                      title="Anuluj"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={subTask.id}
                className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                  subTask.completed
                    ? "bg-slate-100 dark:bg-slate-700/50"
                    : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className={`font-medium truncate ${
                      subTask.completed
                        ? "line-through text-slate-500 dark:text-slate-400"
                        : "text-slate-800 dark:text-slate-100"
                    }`}
                  >
                    {subTask.name}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                      difficultyColors[subTask.difficulty]
                    } ${subTask.completed ? "opacity-60" : ""}`}
                  >
                    {subTask.difficulty}
                  </span>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {!subTask.completed && (
                    <>
                      <button
                        onClick={() =>
                          onCompleteSubTask(
                            group.id,
                            subTask.id,
                            subTask.difficulty
                          )
                        }
                        title="Ukończ podzadanie"
                        className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 rounded-full transition-colors"
                      >
                        <CheckIcon className="w-5 h-5" />
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => handleStartEdit(subTask)}
                          title="Edytuj podzadanie"
                          className="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 rounded-full transition-colors"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => onDeleteSubTask(group.id, subTask.id)}
                          title="Usuń podzadanie"
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TaskGroupListItem;
