const express = require('express');
const router = express.Router();
const BloodStock = require('../models/BloodStock');
const protect = require('../middleware/authmiddleware');
const authorize = require('../middleware/authorize');

// POST /api/blood-stock/update
// Only blood banks can update their stock
router.post('/update', protect, authorize('bloodBank'), async (req, res) => {
  const { bloodGroup, unit } = req.body;

  try {
    const stock = await BloodStock.findOneAndUpdate(
      { bloodGroup, bloodBank: req.user._id },
      { unit, lastUpdated: Date.now() },
      { upsert: true, new: true }
    );

    res.json({ message: 'Stock updated', stock });
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
});

module.exports = router;
