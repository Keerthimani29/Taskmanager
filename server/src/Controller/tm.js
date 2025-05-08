const { task, login } = require('../Models/tm');
const jwt = require('jsonwebtoken');

// Create new user
async function createUser(username, password) {
    const add = await login.create({
        username,
        password,
    });
    console.log("User Added Successfully!");
    return add;
}

// Validate user and generate token
async function validateUser(username, password) {
    const user = await login.findOne({ username, password });
    if (user) {
        console.log("User Exists!!");

        const secret_key = "itssecret";

        const token = jwt.sign({
            id: user._id,  // Use user._id here
            username: user.username
        }, secret_key, { expiresIn: '1hr' });

        return token;
    } else {
        console.log("User Does Not Exist!!");
        return null;
    }
}

// Add new task
async function addTask(id, name, des, date, priority, userId) {
    const add = await task.create({
        taskid: id,
        taskname: name,
        description: des,
        duedate: date,
        priority: priority,
        userId: userId, // Store userId from login table
    });
    return add;
}

// Middleware for authentication
async function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Unauthorized');

    try {
        const decoded = jwt.verify(token, 'your_secret');
        const user = await login.findById(decoded.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(403).send('Invalid token');
    }
}

// Delete task by taskid
async function deleteTask(taskId) {
    try {
        const result = await task.deleteOne({ taskid: taskId });
        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
}

// Update task by taskid
async function updateTask(taskId, updatedData) {
    try {
        const updatedTask = await task.findOneAndUpdate(
            { taskid: Number(taskId) },
            { $set: updatedData },
            { new: true }
        );
        if (!updatedTask) {
            return null;
        }
        return updatedTask;
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
}

module.exports = { addTask, deleteTask, createUser, validateUser, updateTask, authMiddleware };
