const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const taskschema = new mongoose.Schema({
    taskid :  { type: Number, required: true },
    taskname : String,
    description : String,
    duedate : Date,
    priority : String,
    // Add this field
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'login',
    required: true
  },

},{
    timestamps : true
})

const task = mongoose.model('task', taskschema);



//login schema

const loginSchema = new mongoose.Schema({
    username : String,
    password : String,
    
},{
    timestamps : true
})
const login = mongoose.model('login', loginSchema);

module.exports = {task, login};