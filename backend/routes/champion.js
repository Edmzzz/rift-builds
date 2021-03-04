const express = require('express');
const router = express.Router();

const ChampionController = require('../controllers/champion');

router.get('/all', ChampionController.getAllChampions);

// Get one champion
router.get('/:championName', ChampionController.getOneChampion);

module.exports = router;