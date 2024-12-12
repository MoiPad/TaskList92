import React, { useState, useEffect } from "react";
import { getTasks } from "../services/taskService";
import TaskForm from "./TaskForm";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Cargar las tareas desde el backend
  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error al cargar las tareas", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Actualizar el estado local después de guardar
  const handleSave = (newTask, isUpdate = false) => {
    if (isUpdate) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === newTask.id ? newTask : task))
      );
    } else {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }
    setTaskToEdit(null); // Limpia el formulario después de guardar
  };

  return (
    <div>
      <TaskForm
        taskToEdit={taskToEdit}
        onSave={handleSave}
      />
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.titulo} - {task.estado ? "Completado" : "Pendiente"}
            <button onClick={() => setTaskToEdit(task)}>Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;

