import React, { useState } from "react";
import Swal from "sweetalert2";
import { createTask, updateTask } from "../services/taskService";
import 'bootstrap/dist/css/bootstrap.min.css';  // Importar los estilos de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Importar el JS de Bootstrap

const TaskForm = ({ taskToEdit, onSave }) => {
  const [titulo, setTitulo] = useState(taskToEdit ? taskToEdit.titulo : "");
  const [estado, setEstado] = useState(taskToEdit ? taskToEdit.estado : false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let newTask;
      if (taskToEdit) {
        newTask = await updateTask(taskToEdit.id, { titulo, estado });
        Swal.fire("Actualizado", "Tarea actualizada exitosamente", "success");
      } else {
        newTask = await createTask({ titulo, estado });
        Swal.fire("Creado", "Tarea creada exitosamente", "success");
      }

      if (onSave) onSave(newTask, !!taskToEdit); // Pasar la nueva tarea
      setTitulo("");
      setEstado(false);
      setShowModal(false);
    } catch (error) {
      Swal.fire("Error", "Algo salió mal", "error");
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div>
      {showModal && (
        <div className="modal show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{taskToEdit ? "Editar Tarea" : "Agregar Tarea"}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="titulo" className="form-label">Título</label>
                    <input
                      type="text"
                      id="titulo"
                      className="form-control"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="estado" className="form-label">Estado</label>
                    <select
                      id="estado"
                      className="form-select"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value === "true")}
                    >
                      <option value="false">Pendiente</option>
                      <option value="true">Completado</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {taskToEdit ? "Actualizar" : "Crear"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskForm;


