/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { ICreateTask } from "../../types";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  validateDate,
  validateField,
} from "../../helper/validation/formValidator";
import toast from "react-hot-toast";

interface TaskFormProps {
  onSubmit: (task: ICreateTask) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "completed" | "in-progress">(
    "pending"
  );
  const [dueDate, setDueDate] = useState("");
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
      const newTask: ICreateTask = {
        completed: status === "completed" ? true : false,
        description,
        dueDate: new Date(dueDate),
        status,
        title,
      };
      onSubmit(newTask);
      // Reset form
      setTitle("");
      setDescription("");
      setStatus("pending");
      setDueDate("");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 mb-6 p-5 rounded-lg bg-gray-100"
    >
      {/* Title Field */}
      <TextField
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
      <FormControl fullWidth variant="outlined">
        <InputLabel>Status</InputLabel>
        <Select
          name="status"
          id="status"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "pending" | "in-progress" | "completed")
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

      {/* Submit Button */}
      <Button variant="contained" color="primary" type="submit" fullWidth>
        Add Task
      </Button>
    </form>
  );
};

export default TaskForm;
