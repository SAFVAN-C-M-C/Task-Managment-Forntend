/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import { ITask, IUpdateTask } from '../../types';
import { validateDate, validateField } from '../../helper/validation/formValidator';
import toast from 'react-hot-toast';


interface EditTaskProps {
    task:ITask;
    setOpenEditTask: Dispatch<SetStateAction<boolean>>;
    onSubmit: (task: IUpdateTask) => void;
  }
const EditTask:FC<EditTaskProps> = ({onSubmit,setOpenEditTask,task}) => {
    const [title, setTitle] = useState(task.title||"");
    const [description, setDescription] = useState(task.description||"");
    const [status, setStatus] = useState<"pending" | "completed" | "in-progress" |string>(
      task.status ||"pending"
    );
    const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
    const handleClose = () => {
        setOpenEditTask(false);
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          const formData = new FormData(e.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const { title, description, dueDate, status } = formJson;
          if (!validateField(title)) {
            toast.error("Title is required");
            return;
          }
          if (!validateField(description)) {
            toast.error("Description is required");
            return;
          }
          if (!validateDate(dueDate)) {
            toast.error("Select a valid date");
            return;
          }
          if (!validateField(status)) {
            toast.error("select a status");
            return;
          }
          const newTask: IUpdateTask = {
            taskId:task._id.toString(),
            completed: status === "completed" ? true : false,
            description,
            dueDate: new Date(dueDate),
            status,
            title,
          };
          onSubmit(newTask);
          handleClose()
        } catch (error: any) {
          console.log(error.message);
        }
      };
  return (
    <>
      <Dialog
        open
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle align='center'>Edit Tasks</DialogTitle>
        <DialogContent >
          {/* Title Field */}
          <TextField
          style={{marginBottom:10,marginTop:10}}
            label="Task Title"
            variant="outlined"
            fullWidth
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Description Field */}
          <TextField
          style={{marginBottom:10,marginTop:5}}
            label="Task Description"
            variant="outlined"
            fullWidth
            name="description"
            id="description"
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {/* Status Dropdown */}
          <FormControl style={{marginBottom:10,marginTop:5}} fullWidth variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as "pending" | "in-progress" | "completed"
                )
              }
              label="Status"
              required
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>

          {/* Due Date Field */}
          <TextField
          style={{marginBottom:10,marginTop:5}}
            name="dueDate"
            id="dueDate"
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EditTask