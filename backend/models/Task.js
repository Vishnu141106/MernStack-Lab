const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    date: {
      type: String,
      required: [true, 'Date is required']
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    }
  },
  {
    timestamps: true,
    collection: 'tasks' // Explicitly enforce collection name 'tasks' in 'smartstudy' DB
  }
);

module.exports = mongoose.model('Task', taskSchema, 'tasks');
