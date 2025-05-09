const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const taskSchema = new mongoose.Schema({
  taskid: { type: Number, required: true },
  taskname: { type: String },
  description: { type: String },
  duedate: { type: Date },
  priority: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending"
  },
}, {
  timestamps: true
});

const task = mongoose.model('task', taskSchema);




//login schema

const loginSchema = new mongoose.Schema({
    username : String,
    
    password : String,
    
},{
    timestamps : true
})
const login = mongoose.model('login', loginSchema);

module.exports = {task, login};