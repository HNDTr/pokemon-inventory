const {Router} = require('express');
const multer = require('multer');
const {getPokemon, newPokemonFormGET, addPokemonPOST, getOnePokemon, editPokemon} = require('../controllers/pokemonController')

const pokemonRouter = Router();
const upload = multer({ dest: 'uploads/' });

pokemonRouter.get('/', getPokemon);

// pokemonRouter.get('/:id', getOnePokemon);

pokemonRouter.get('/new', newPokemonFormGET);

pokemonRouter.get('/:id', getOnePokemon);

pokemonRouter.post('/new', upload.single('image'), addPokemonPOST);

pokemonRouter.put('/edit/:id', editPokemon)



module.exports = pokemonRouter;
