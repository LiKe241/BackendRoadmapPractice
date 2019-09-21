const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('GET route on things.');
});

router.post('/', (req, res) => {
  res.send('POST route on things.');
});

// uses RegExp to match request URLs, unmatched URLs won't be handled
router.get('/:name/:id([0-9]{5})', (req, res) => {
  res.send('Received name: ' + req.params.name + ' and id: ' + req.params.id);
});

module.exports = router;
