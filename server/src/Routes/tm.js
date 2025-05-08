const express = require('express');
const router = express.Router();
const {task , login} = require('../Models/tm');
const {addTask , getAllTasks , deleteTask , createUser , validateUser ,updateTask , authMiddleware} = require('../Controller/tm.js');

router.get('/hello', (req, res) => {
    res.send('Hello from the task manager API!');
});



router.post('/login/submitted',async (req,res)=>{
    console.log(req.body);
  
  
    //const username = req.body.username;
    //const password = req.body.password;
    //the above can be done in Object destructuring
    const {username , password} = req.body;

    const addUser = await createUser(username,password);
    if (addUser) {
        res.send('success');
      } else {
        res.send('fail');
      }
   

})

router.post('/login/validate',async (req,res)=>{
    console.log(req.body);

    const {username,password} = req.body;
    const login = await validateUser(username,password);
    
    if (login) {
        res.send('success');
      } else {
        res.send('fail');
      }
})





router.post('/getform', authMiddleware, (req, res) => {
    console.log(req.body);

    const {taskid, taskname , description , duedate , priority} = req.body;
    const userId = req.user._id;  // assuming user is authenticated and attached to request


    const result = addTask(taskid, taskname , description, duedate, priority , userId);
    res.send("All values are received and added to the database");
});


router.delete('/delete/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
        const result = await deleteTask(taskId);
        if (result) {
            res.status(200).send('Task deleted successfully');
        } else {
            res.status(404).send('Task not found');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Internal server error');
    }
});





router.put('/update/:id', async (req, res) => {
  const taskId = Number(req.params.id);  // Convert to Number since taskid is Number
  const { taskname, description, duedate, priority } = req.body;

  try {
      // Use taskid instead of _id
      const updatedTask = await task.findOneAndUpdate(
          { taskid: taskId },
          { taskname, description, duedate, priority },
          { new: true } // Return the updated document
      );

      if (!updatedTask) {
          return res.status(404).send('Task not found');
      }

      res.status(200).send(updatedTask);
  } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).send('Internal server error');
  }
});



router.get('/server/getAll', authMiddleware, async (req, res) => {
    try {
      const tasks = await task.find({ userId: req.user._id });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Server Error' });
    }
  });
  

module.exports = router;