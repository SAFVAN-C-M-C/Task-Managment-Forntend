/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Home.tsx
import React, { useEffect, useState } from "react";

import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ICreateTask, ITask, IUpdateTask, IUpdateTaskRes } from "../types";
// import TaskForm from '../components/Home/TaskForm';
import TaskList from "../components/Home/TaskList";
import { config, SERVER_URL } from "../common/api";
import Header from "../components/Home/Header";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import AddTask from "../components/Modals/AddTask";
import { useSocket } from "../context/SocketContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const Home: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [taskStats, setTaskStats] = useState({
    completed: 0,
    pending: 0,
    inProgress: 0,
  });
  const [opedAddTask, setOpenAddTask] = useState(false);
  // Fetch tasks and calculate task stats
  const fetchTasks = async (data: { page: number; filter: string }) => {
    const response = await axios.get(
      `${SERVER_URL}/api/tasks?page=${data.page}&limit=9&filter=${data.filter}`,
      config
    );
    console.log(response);

    setTasks(response.data.data);
    if (page >= response.data.totalPage) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
    const { completed, pending, inProgress } = response.data;

    setTaskStats({ completed, pending, inProgress });
  };

  useEffect(() => {
    fetchTasks({ page, filter });
  }, [filter]);
  const pageLoad = async (data: { page: number; filter: string }) => {
    const response = await axios.get(
      `${SERVER_URL}/api/tasks?page=${data.page}&limit=9&filter=${data.filter}`,
      config
    );

    setTasks((tasks) => [...tasks, ...response.data.data]);
    if (page >= response.data.totalPage) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
    const { completed, pending, inProgress } = response.data;

    setTaskStats({ completed, pending, inProgress });
  };
  useEffect(() => {
    if (page > 1) {
      pageLoad({ page, filter });
    }
  }, [page]);

  const handleAddTask = async (task: ICreateTask) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/task/create`,
        task,
        config
      );
      if (response.status === 201) {
        setTasks((prevTasks) => [response.data.data, ...prevTasks]);
        toast.success("New Task Added");
      }
    } catch (error: any) {
      console.error(error.message);
      toast.error("Something went wrong,please try again!");
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await axios.delete(
        `${SERVER_URL}/api/task/${id}`,
        config
      );
      if (response.status === 200) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
        toast.success("Task Deleted");
      }
    } catch (error: any) {
      console.error(error.message);
      toast.error("Something went wrong,please try again!");
    }
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
  };

  const handleEditTask = async (task: IUpdateTask) => {
    try {
      const { taskId, ...updateData } = task;
      const response = await axios.patch(
        `${SERVER_URL}/api/task/${taskId}`,
        updateData,
        config
      );
      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t._id === response.data.data._id ? response.data.data : t
          )
        );
        toast.success("Task Updated");
      }
    } catch (error: any) {
      console.error(error.message);
      toast.error("Something went wrong,please try again!");
    }
  };

  // Data for the doughnut chart
  const data = {
    labels: ["Completed Tasks", "Pending Tasks", "In progress Tasks"],
    datasets: [
      {
        label: "Task Stats",
        data: [taskStats.completed, taskStats.pending, taskStats.inProgress],
        backgroundColor: ["#4ade80", "#FF5F15", "#305ec2"],
        borderWidth: 1,
      },
    ],
  };

  //socket
  useEffect(() => {
    if (socket) {
      const handleTaskUpdated = (updatedTask: IUpdateTaskRes) => {
        const status = updatedTask.task.status;
        const prevStatus = updatedTask.prevStatus;
        if (status === "completed" && prevStatus === "in-progress") {
          setTaskStats((prevState) => ({
            completed: prevState.completed + 1,
            pending: prevState.pending,
            inProgress: prevState.inProgress - 1,
          }));
        } else if (status === "completed" && prevStatus === "pending") {
          setTaskStats((prevState) => ({
            completed: prevState.completed + 1,
            pending: prevState.pending - 1,
            inProgress: prevState.inProgress,
          }));
        } else if (status === "in-progress" && prevStatus === "completed") {
          setTaskStats((prevState) => ({
            completed: prevState.completed - 1,
            pending: prevState.pending,
            inProgress: prevState.inProgress + 1,
          }));
        } else if (status === "in-progress" && prevStatus === "pending") {
          setTaskStats((prevState) => ({
            completed: prevState.completed,
            pending: prevState.pending - 1,
            inProgress: prevState.inProgress + 1,
          }));
        } else if (status === "pending" && prevStatus === "completed") {
          setTaskStats((prevState) => ({
            completed: prevState.completed - 1,
            pending: prevState.pending + 1,
            inProgress: prevState.inProgress,
          }));
        } else if (status === "pending" && prevStatus === "in-progress") {
          setTaskStats((prevState) => ({
            completed: prevState.completed,
            pending: prevState.pending + 1,
            inProgress: prevState.inProgress - 1,
          }));
        }
      };
  
      const handleNewTaskCreated = (newTask: ITask) => {
        const status = newTask.status;
        if (status === "completed") {
          setTaskStats((prevState) => ({
            completed: prevState.completed + 1,
            pending: prevState.pending,
            inProgress: prevState.inProgress,
          }));
        } else if (status === "pending") {
          setTaskStats((prevState) => ({
            completed: prevState.completed,
            pending: prevState.pending + 1,
            inProgress: prevState.inProgress,
          }));
        } else if (status === "in-progress") {
          setTaskStats((prevState) => ({
            completed: prevState.completed,
            pending: prevState.pending,
            inProgress: prevState.inProgress + 1,
          }));
        }
      };
  
      const handleTaskDeleted = (deletedTask: ITask) => {
        const status = deletedTask.status;
        if (status === "completed") {
          setTaskStats((prevState) => ({
            completed: prevState.completed - 1,
            pending: prevState.pending,
            inProgress: prevState.inProgress,
          }));
        } else if (status === "pending") {
          setTaskStats((prevState) => ({
            completed: prevState.completed,
            pending: prevState.pending - 1,
            inProgress: prevState.inProgress,
          }));
        } else if (status === "in-progress") {
          setTaskStats((prevState) => ({
            completed: prevState.completed,
            pending: prevState.pending,
            inProgress: prevState.inProgress - 1,
          }));
        }
      };
  
      socket.on("TaskUpdated", handleTaskUpdated);
      socket.on("NewTaskCreated", handleNewTaskCreated);
      socket.on("TaskDeleted", handleTaskDeleted);
  
      return () => {
        socket.off("TaskUpdated", handleTaskUpdated);
        socket.off("NewTaskCreated", handleNewTaskCreated);
        socket.off("TaskDeleted", handleTaskDeleted);
      };
    }
  }, [socket]);
  

  return (
    <>
      {opedAddTask ? (
        <AddTask onSubmit={handleAddTask} setOpenAddTask={setOpenAddTask} />
      ) : null}
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Hi {user?.name} 👋
        </h1>
        {/* lap */}
        <div className="lg:grid hidden grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task List */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold ">Your Tasks:</h2>
              <span
                onClick={() => setOpenAddTask(!opedAddTask)}
                className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-700 cursor-pointer"
              >
                Add Task
              </span>
            </div>
            {/* <TaskForm onSubmit={handleAddTask} />  */}
            <TaskList
              filter={filter}
              setFilter={setFilter}
              hasMore={hasMore}
              page={page}
              setPage={setPage}
              tasks={tasks}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          </div>
          {/* Task Stats */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Task Statistics
            </h2>
            <Doughnut data={data} />
          </div>
        </div>
        {/* for modbile */}
        <div className="grid grid-cols-1 lg:hidden gap-8">
          {/* Task Stats */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Task Statistics
            </h2>
            <Doughnut data={data} />
          </div>
          {/* Task List */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold ">Your Tasks:</h2>
              <span
                onClick={() => setOpenAddTask(!opedAddTask)}
                className="p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-700 cursor-pointer"
              >
                Add Task
              </span>
            </div>
            {/* <TaskForm onSubmit={handleAddTask} /> */}
            <TaskList
              filter={filter}
              setFilter={setFilter}
              hasMore={hasMore}
              page={page}
              setPage={setPage}
              tasks={tasks}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
