import React, { useState } from 'react';
import styles from './App.module.css'; // Scoped CSS module

function App() {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(prev => !prev);

  return (
    <div className={styles.appContainer}>
      <button onClick={toggleModal} className={styles.addButton}>Add Task</button>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Add Task</h2>
            <form action="http://localhost:5000/server/getform" method="POST" className={styles.form}>
              <label>
                Task ID:
                <input type="text" name="taskid" />
              </label>
              <label>
                Task:
                <input type="text" name="taskname" />
              </label>
              <label>
                Description:
                <input type="text" name="description" />
              </label>
              <label>
                Due Date:
                <input type="date" name="duedate" />
              </label>
              <label>
                Priority:
                <select name="priority">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <div className={styles.buttonRow}>
                <button type="submit" className={styles.submitBtn}>Submit</button>
                <button type="button" onClick={toggleModal} className={styles.closeBtn}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
