import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Display() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [editData, setEditData] = useState({
    taskid: '',
    taskname: '',
    description: '',
    duedate: '',
    priority: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token'); // or wherever you're storing it
      const response = await axios.post('http://localhost:5000/getAll', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Fetched Tasks:', response.data);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // handle edit button click
  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find(task => task.taskid === taskId);
    if (taskToEdit) {
      setEditData({
        taskid: taskToEdit.taskid,
        taskname: taskToEdit.taskname,
        description: taskToEdit.description,
        duedate: taskToEdit.duedate,
        priority: taskToEdit.priority
      });
      setCurrentTaskId(taskId); // Set the current task ID for editing  
      setShowModal(true); // Show the modal for editing
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/server/delete/${taskId}`);
      if (response.status === 200) {
        setTasks(tasks.filter(task => task.taskid !== taskId));
        console.log('Task deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSubmitEdit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/server/update/${editData.taskid}`, editData);
      if (response.status === 200) {
        const updatedTasks = tasks.map(task =>
          task.taskid === editData.taskid ? { ...task, ...editData } : task
        );
        setTasks(updatedTasks);
        setShowModal(false); // Close the modal
        console.log('Task updated successfully');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="task-wrapper">
      <div className="task-container py-5">
        <div className="container-fluid px-4" style={{ maxWidth: "1200px" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="font-weight-bold">Assigned Tasks</h2>
          </div>

          <div className="row justify-content-center">
            {tasks.map((task, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="card task-card shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="card-title text-primary mb-0">{task.taskid}</h4>
                    </div>

                    <div className="info-row py-2 border-bottom">
                      <i className="bi bi-card-text text-info me-2"></i>
                      <span className="text-muted">Task:</span>
                      <span className="ms-auto fw-bold">{task.taskname}</span>
                    </div>

                    <div className="info-row py-2 border-bottom">
                      <i className="bi bi-cash-stack text-success me-2"></i>
                      <span className="text-muted">Description:</span>
                      <span className="ms-auto fw-bold">{task.description}</span>
                    </div>
                    <div className="card-text">
                      <div className="info-row py-2 border-bottom">
                        <i className="bi bi-clock-fill text-warning me-2"></i>
                        <span className="text-muted">Due Date:</span>
                        <span className="ms-auto fw-bold">{formatDate(task.duedate)}</span>
                      </div>
                      
                      <div className="info-row py-2 border-bottom">
                        <i className="bi bi-people-fill text-danger me-2"></i>
                        <span className="text-muted">Priority:</span>
                        <span className="ms-auto fw-bold">{task.priority}</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                      <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(task.taskid)}>
                        <i className="bi bi-pencil-square me-1"></i>Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.taskid)}>
                        <i className="bi bi-trash me-1"></i>Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for editing task */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Task</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitEdit}>
                  <div className="form-group">
                    <label>Task ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.taskid}
                      onChange={(e) => setEditData({ ...editData, taskid: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Task Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.taskname}
                      onChange={(e) => setEditData({ ...editData, taskname: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editData.duedate}
                      onChange={(e) => setEditData({ ...editData, duedate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      className="form-control"
                      value={editData.priority}
                      onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">Save changes</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Close
                    </button>
                    
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .task-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f9fa;
          padding: 2rem;
        }

        .task-container {
          width: 80%;
          max-width: 1200px;
        }

        .task-card {
          transition: all 0.3s ease;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .task-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 1rem 3rem rgba(0, 0, 0, .175)!important;
        }

        .info-row {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .info-row i {
          font-size: 1.2rem;
        }

        .info-row span {
          font-size: 1rem;
        }

      
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0;
  }

  .close {
    font-size: 1.5rem;
    color: #333;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .close:hover {
    color: #ff0000;
    transform: scale(1.2);
  }

  .close span {
    font-size: 2rem;
  }



        .form-group label {
          font-weight: bold;
        }

        .form-control {
          border-radius: 10px;
          padding: 0.8rem;
        }

        .btn {
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

export default Display;
