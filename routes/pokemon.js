const {Router} = require('express');
const multer = require('multer');
const {getPokemon, newPokemonFormGET, addPokemonPOST} = require('../controllers/pokemonController')

const pokemonRouter = Router();
const upload = multer({ dest: 'uploads/' });

pokemonRouter.get('/', getPokemon)

pokemonRouter.get('/new', newPokemonFormGET)

pokemonRouter.post('/new', upload.single('image'), addPokemonPOST)

module.exports = pokemonRouter;
