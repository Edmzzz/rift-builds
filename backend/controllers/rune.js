const runes = require('../data/wildriftrunes.json');

const getAllRunes = (req, res, next) => {
	res.status(200).json(runes);
}

module.exports = {
	getAllRunes
}