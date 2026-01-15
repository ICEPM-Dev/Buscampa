import { useState, useEffect } from "react";
import { taskService } from "../services/api";
import type { Task, CreateTaskDTO, UpdateTaskDTO } from "../types/task";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Cargar tareas al iniciar
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setError(null);
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError("Error al cargar las tareas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateTaskDTO | UpdateTaskDTO) => {
    try {
      const newTask = await taskService.createTask(data as CreateTaskDTO);
      setTasks([...tasks, newTask]);
      setShowForm(false);
    } catch (err) {
      setError("Error al crear la tarea");
      console.error(err);
      throw err;
    }
  };

  const handleUpdate = async (task: Task, data: UpdateTaskDTO) => {
    try {
      const updatedTask = await taskService.updateTask(task.id, data);
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
      setEditingTask(null);
    } catch (err) {
      setError("Error al actualizar la tarea");
      console.error(err);
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await taskService.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError("Error al eliminar la tarea");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestor de Tareas</h1>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Cargando tareas...</p>
        </div>
      )}

      {/* Botón "Nueva Tarea" */}
      {!showForm && !editingTask && !loading && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
        >
          + Nueva Tarea
        </button>
      )}

      {/* Formulario para crear */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-4">Crear Nueva Tarea</h2>
          <TaskForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            submitLabel="Crear Tarea"
          />
        </div>
      )}

      {/* Formulario para editar */}
      {editingTask && (
        <div className="bg-gray-50 p-6 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-4">Editar Tarea</h2>
          <TaskForm
            initialData={editingTask}
            onSubmit={(data) => handleUpdate(editingTask, data)}
            onCancel={() => setEditingTask(null)}
            submitLabel="Guardar Cambios"
          />
        </div>
      )}

      {/* Lista de tareas */}
      <div className="space-y-3 mt-6">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deletingId === task.id}
          />
        ))}
      </div>

      {/* Empty state */}
      {tasks.length === 0 && !loading && !showForm && !editingTask && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay tareas aún</p>
          <p className="text-gray-400 text-sm mt-1">
            Crea tu primera tarea usando el botón de arriba
          </p>
        </div>
      )}
    </div>
  );
}
