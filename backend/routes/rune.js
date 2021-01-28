const express = require('express');
const router = express.Router();

const RuneController = require('../controllers/rune');

router.get('/all', RuneController.getAllRunes);

module.exports = router;