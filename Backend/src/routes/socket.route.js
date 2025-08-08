const express = require('express');
const router = express.Router();

router.get('/socket', (req, res) => {
  const io = req.app.get('io'); // get io instance from app
  const { message } = req.body;

  if (!io) {
    return res.status(500).json({ success: false, message: 'Socket server not initialized' });
  }

  io.emit('notification', { message });
  res.status(200).json({ success: true, message: 'Notification sent' });
});

module.exports = router;
