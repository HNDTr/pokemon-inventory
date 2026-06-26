const {Router} = require('express');
const multer = require('multer');
const {getPokemon, newPokemonFormGET, addPokemonPOST, getOnePokemon, editPokemonGET, editPokemonPUT, deletePokemon} = require('../controllers/pokemonController')

const pokemonRouter = Router();
const upload = multer({ dest: 'uploads/' });

pokemonRouter.get('/', getPokemon);

// pokemonRouter.get('/:id', getOnePokemon);

pokemonRouter.get('/new', newPokemonFormGET);

pokemonRouter.get('/:id', getOnePokemon);

pokemonRouter.post('/new', upload.single('image'), addPokemonPOST);

pokemonRouter.get('/edit/:id', editPokemonGET);

pokemonRouter.post('/edit/:id', upload.single('image'), editPokemonPUT);

pokemonRouter.post('/delete/:id', deletePokemon)

module.exports = pokemonRouter;
