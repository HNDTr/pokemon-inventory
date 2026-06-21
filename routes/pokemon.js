const {Router} = require('express');
const {getPokemon, newPokemonFormGET} = require('../controllers/pokemonController')

const pokemonRouter = Router();

pokemonRouter.get('/', getPokemon)

pokemonRouter.get('/new', newPokemonFormGET)


module.exports = pokemonRouter;
