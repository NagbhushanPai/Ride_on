const express = require('express');
const router = express.Router();
const Cycle = require('../models/Cycle');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// @route   GET api/cycles
// @desc    Get all cycles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const cycles = await Cycle.find();
    res.json(cycles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/cycles/:id
// @desc    Get cycle by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id);
    
    if (!cycle) {
      return res.status(404).json({ msg: 'Cycle not found' });
    }
    
    res.json(cycle);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Cycle not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/cycles
// @desc    Create a cycle
// @access  Private (Admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  const { 
    name, 
    category, 
    description, 
    price, 
    wheelSize, 
    image, 
    features 
  } = req.body;

  try {
    const newCycle = new Cycle({
      name,
      category,
      description,
      price,
      wheelSize,
      image,
      features
    });

    const cycle = await newCycle.save();
    res.json(cycle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/cycles/:id
// @desc    Update a cycle
// @access  Private (Admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    let cycle = await Cycle.findById(req.params.id);
    
    if (!cycle) {
      return res.status(404).json({ msg: 'Cycle not found' });
    }
    
    cycle = await Cycle.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    );
    
    res.json(cycle);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Cycle not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/cycles/:id
// @desc    Delete a cycle
// @access  Private (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id);
    
    if (!cycle) {
      return res.status(404).json({ msg: 'Cycle not found' });
    }
    
    await cycle.remove();
    res.json({ msg: 'Cycle removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Cycle not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/cycles/category/:category
// @desc    Get cycles by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const cycles = await Cycle.find({ category: req.params.category });
    res.json(cycles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 