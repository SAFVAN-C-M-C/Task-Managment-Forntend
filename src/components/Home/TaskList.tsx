
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { ITask, IUpdateTask } from "../../types";
import TaskCard from "./TaskCard";
import Grid from "@mui/material/Grid2";
import {
  FormControl,
  InputLabel,
  MenuItem,
  
  Select,
  SelectChangeEvent,
  
} from "@mui/material";
import NothingHere from "../NothingHere";

interface TaskListProps {
  tasks: ITask[];
  onDelete: (id: string) => void;
  onEdit: (task: IUpdateTask) => void;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  hasMore: boolean;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

const TaskList: React.FC<TaskListProps> = ({
  filter,
  setFilter,
  tasks,
  onDelete,
  onEdit,
  hasMore,

  setPage,
}) => {
  // Handle filter change for status
  const handleFilterStatus = (event: SelectChangeEvent<any>) => {
    setFilter(event.target.value as string);
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };
  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex justify-between mb-4">
        {/* Filter by Status */}
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filter} onChange={handleFilterStatus} label="Status">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </div>
      {/* {
  tasks && tasks.length > 0 ? (
    <>
      {tasks.map((task) => (
        <TaskCard task={task} key={task._id} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </>
  ) : (
    <p>No data</p>
  )
} */}
{tasks && tasks.length > 0 ? (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {tasks?.map((task, index) => (
            <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
              
              <TaskCard task={task} key={index} onDelete={onDelete} onEdit={onEdit} />
              
            </Grid>
          ))}
        </Grid>
      ) : (
        <NothingHere />
      )}

      {hasMore && (
        <div
          onClick={loadMore}
          className="w-full cursor-pointer flex justify-center "
        >
          Load More
        </div>
      )}
    </div>
  );
};

export default TaskList;
