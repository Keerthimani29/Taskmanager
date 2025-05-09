const { task, login } = require('../Models/tm');
const jwt = require('jsonwebtoken');

// Create new user
async function createUser(username,userid, password) {
    const add = await login.create({
        username,
        userid,
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
async function addTask(id, name, des, date, priority) {
    const add = await task.create({
        taskid: id,
        taskname: name,
        description: des,
        duedate: date,
        priority: priority,
        // Store userId from login table
    });
    return add;
}

async function getAllTasks() {
    try {
        const tasks = await task.find({});
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
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

module.exports = { addTask, deleteTask, createUser, validateUser, updateTask ,getAllTasks };
