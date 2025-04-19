const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// Get all reminders for a user
router.get('/:userId', async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.params.userId }).sort({ date: 1, time: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new reminder
router.post('/', async (req, res) => {
  const reminder = new Reminder({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    time: req.body.time,
    userId: req.body.userId,
  });

  try {
    const newReminder = await reminder.save();
    res.status(201).json(newReminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a reminder
router.patch('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    // Update only the fields that are present in the request
    Object.keys(req.body).forEach(key => {
      reminder[key] = req.body[key];
    });
    
    const updatedReminder = await reminder.save();
    res.json(updatedReminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a reminder
router.delete('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
