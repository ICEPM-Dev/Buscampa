import axios from "axios";
import type { Task, CreateTaskDTO, UpdateTaskDTO } from "../types/task";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    const res = await api.get("/tasks");
    return res.data;
  },
  getTaskById: async (id: number): Promise<Task> => {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },
  createTask: async (data: CreateTaskDTO): Promise<Task> => {
    const res = await api.post("/tasks", data);
    return res.data;
  },
  updateTask: async (id: number, data: UpdateTaskDTO): Promise<Task> => {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },
  deleteTask: async (id: number): Promise<Task> => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },
};
