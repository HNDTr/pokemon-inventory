const {Router} = require('express');
const {getPokemon} = require('../controllers/pokemonController')

const pokemonRouter = Router();

pokemonRouter.get('/', getPokemon)


module.exports = pokemonRouter;
