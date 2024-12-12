import React, { useState, useEffect } from "react";
import { getTasks, deleteTask, updateTask, createTask } from "../services/taskService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';  // Importar los estilos de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Importar el JS de Bootstrap

const TaskList = ({ onEdit }) => {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [estado, setEstado] = useState("false");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás recuperar esta tarea.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "No, cancelar!",
    });

    if (confirm.isConfirmed) {
      await deleteTask(id);
      Swal.fire("¡Eliminado!", "La tarea ha sido eliminada.", "success");
      loadTasks();
    }
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setShowOffcanvas(true);
  };

  const handleChange = (e) => {
    setTaskToEdit({ ...taskToEdit, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (taskToEdit) {
      await updateTask(taskToEdit.id, taskToEdit);
      Swal.fire("¡Actualizado!", "La tarea ha sido actualizada.", "success");
      loadTasks();
      setShowOffcanvas(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const newTask = await createTask({ titulo, estado });
      Swal.fire("Creado", "Tarea creada exitosamente", "success");
      setTitulo("");
      setEstado("false");
      setShowModal(false);
      loadTasks();
    } catch (error) {
      Swal.fire("Error", "Algo salió mal", "error");
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="container">
      <button className="btn btn-primary mb-3" onClick={openModal}>
        <FontAwesomeIcon icon={faPlus} /> Agregar Tarea
      </button>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Título</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.titulo}</td>
                <td>{task.estado ? "Completado" : "Pendiente"}</td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleEdit(task)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(task.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Offcanvas de Bootstrap */}
      <div className={`offcanvas offcanvas-end ${showOffcanvas ? 'show' : ''}`} tabIndex="-1" style={{ visibility: showOffcanvas ? 'visible' : 'hidden' }}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Editar Tarea</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setShowOffcanvas(false)}
          ></button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label htmlFor="titulo" className="form-label">Título</label>
              <input
                type="text"
                className="form-control"
                id="titulo"
                name="titulo"
                value={taskToEdit?.titulo || ''}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="estado" className="form-label">Estado</label>
              <select
                className="form-control"
                id="estado"
                name="estado"
                value={taskToEdit?.estado || 'false'}
                onChange={handleChange}
              >
                <option value="false">Pendiente</option>
                <option value="true">Completado</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Guardar Cambios</button>
          </form>
        </div>
      </div>

      {/* Modal para Crear Tarea */}
      {showModal && (
        <div className="modal show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Tarea</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCreate}>
                  <div className="mb-3">
                    <label htmlFor="titulo" className="form-label">Título</label>
                    <input
                      type="text"
                      className="form-control"
                      id="titulo"
                      name="titulo"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="estado" className="form-label">Estado</label>
                    <select
                      className="form-select"
                      id="estado"
                      name="estado"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                    >
                      <option value="false">Pendiente</option>
                      <option value="true">Completado</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Crear</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background overlay para Modal */}
      {showModal && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={closeModal}
        ></div>
      )}
    </div>
  );
};

export default TaskList;
