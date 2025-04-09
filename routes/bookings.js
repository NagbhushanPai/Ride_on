const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Cycle = require('../models/Cycle');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// @route   GET api/bookings
// @desc    Get all bookings (admin only)
// @access  Private (Admin)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', ['name', 'email'])
      .populate('cycle', ['name', 'category', 'price']);
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/bookings/my
// @desc    Get user bookings
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('cycle', ['name', 'category', 'image', 'price']);
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', ['name', 'email'])
      .populate('cycle', ['name', 'category', 'image', 'price']);
    
    // Check if booking exists
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Make sure user owns the booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', auth, async (req, res) => {
  const {
    cycleId,
    startDate,
    endDate,
    location,
    accessories
  } = req.body;

  try {
    // Check if cycle exists and is available
    const cycle = await Cycle.findById(cycleId);
    
    if (!cycle) {
      return res.status(404).json({ msg: 'Cycle not found' });
    }
    
    if (!cycle.isAvailable) {
      return res.status(400).json({ msg: 'Cycle is not available for booking' });
    }
    
    // Check if cycle is already booked for the requested dates
    const conflictingBooking = await Booking.findOne({
      cycle: cycleId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { 
          startDate: { $lte: new Date(startDate) }, 
          endDate: { $gte: new Date(startDate) } 
        },
        { 
          startDate: { $lte: new Date(endDate) }, 
          endDate: { $gte: new Date(endDate) } 
        },
        { 
          startDate: { $gte: new Date(startDate) }, 
          endDate: { $lte: new Date(endDate) } 
        }
      ]
    });
    
    if (conflictingBooking) {
      return res.status(400).json({ msg: 'Cycle is already booked for the selected dates' });
    }
    
    // Calculate total price
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const totalDays = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24));
    
    if (totalDays < 1) {
      return res.status(400).json({ msg: 'Booking must be for at least one day' });
    }
    
    // Base price calculation
    let totalPrice = cycle.price * totalDays;
    
    // Add price for accessories (example pricing)
    const accessoryPrices = {
      helmet: 5,
      lock: 3,
      basket: 2,
      lights: 4
    };
    
    if (accessories && accessories.length > 0) {
      accessories.forEach(accessory => {
        if (accessoryPrices[accessory]) {
          totalPrice += accessoryPrices[accessory] * totalDays;
        }
      });
    }
    
    // Create new booking
    const newBooking = new Booking({
      user: req.user.id,
      cycle: cycleId,
      startDate,
      endDate,
      location,
      accessories,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    const booking = await newBooking.save();
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/bookings/:id
// @desc    Update booking status
// @access  Private (Admin only for some status changes)
router.put('/:id', auth, async (req, res) => {
  const { status, paymentStatus } = req.body;

  try {
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Check authorization
    const isAdmin = req.user.role === 'admin';
    const isOwner = booking.user.toString() === req.user.id;
    
    if (!isAdmin && !isOwner) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Only admin can confirm or complete bookings
    if ((status === 'confirmed' || status === 'completed') && !isAdmin) {
      return res.status(401).json({ msg: 'Only admin can confirm or complete bookings' });
    }
    
    // Only admin can change payment status
    if (paymentStatus && !isAdmin) {
      return res.status(401).json({ msg: 'Only admin can update payment status' });
    }
    
    // User can only cancel their own bookings
    if (status === 'cancelled' && isOwner) {
      booking.status = 'cancelled';
    }
    
    // Admin can update any status
    if (isAdmin) {
      if (status) booking.status = status;
      if (paymentStatus) booking.paymentStatus = paymentStatus;
    }
    
    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/bookings/:id
// @desc    Delete a booking
// @access  Private (Admin or booking owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Check if user owns the booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Only allow deletion of pending bookings
    if (booking.status !== 'pending' && req.user.role !== 'admin') {
      return res.status(400).json({ msg: 'Only pending bookings can be deleted by users' });
    }
    
    await booking.remove();
    res.json({ msg: 'Booking removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 