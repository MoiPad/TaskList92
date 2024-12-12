import React, { useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [taskToEdit, setTaskToEdit] = useState(null);

  const handleEdit = (task) => {
    setTaskToEdit(task);
  };

  const handleSave = () => {
    setTaskToEdit(null);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Gestión de Tareas</h1>
      <TaskForm taskToEdit={taskToEdit} onSave={handleSave} />
      <TaskList onEdit={handleEdit} />
    </div>
  );
}

export default App;

