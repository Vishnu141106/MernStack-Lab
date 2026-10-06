const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');

// Pre-check MongoDB connection state
router.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Local MongoDB is not running or disconnected. Please start the MongoDB service on Windows ("net start MongoDB" or via services.msc).',
      readyState: mongoose.connection.readyState
    });
  }
  next();
});

// GET /api/tasks - Retrieve all tasks (with optional search, subject, priority, and status filter)
router.get('/', async (req, res) => {
  try {
    const { status, priority, subject, search } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }
    if (priority && priority !== 'All') {
      filter.priority = priority;
    }
    if (subject && subject !== 'All') {
      filter.subject = new RegExp(`^${subject}$`, 'i');
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: error.message
    });
  }
});

// GET /api/tasks/:id - Retrieve a single task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve task',
      error: error.message
    });
  }
});

// POST /api/tasks - Create a new study task
router.post('/', async (req, res) => {
  try {
    const { subject, title, description, date, priority, status } = req.body;

    if (!subject || !title || !date) {
      return res.status(400).json({
        success: false,
        message: 'Subject, Title, and Date are required fields'
      });
    }

    const newTask = new Task({
      subject,
      title,
      description: description || '',
      date,
      priority: priority || 'Medium',
      status: status || 'Pending'
    });

    const savedTask = await newTask.save();
    res.status(201).json({
      success: true,
      message: 'Task created successfully in smartstudy.tasks',
      data: savedTask
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
});

// PUT /api/tasks/:id - Update an existing study task
router.put('/:id', async (req, res) => {
  try {
    const { subject, title, description, date, priority, status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { subject, title, description, date, priority, status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
});

// DELETE /api/tasks/:id - Delete a study task
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Task removed from smartstudy.tasks successfully',
      data: deletedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
});

module.exports = router;
