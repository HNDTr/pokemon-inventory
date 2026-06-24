const db = require('../db/queries');
const { uploadImage } = require('../db/cloudinary/queries');
const {body, validationResult, matchedData} = require('express-validator');

async function getPokemon(req, res) {
    const sortOrder = req.query.sort === 'desc' ? 'desc' : 'asc';
    const selectedTypes = [].concat(req.query.types || []).filter(Boolean);
    const types = await db.getAllTypes();
    const pokemon = await db.getAllPokemon({ sort: sortOrder, types: selectedTypes });

    res.render('pokemon', {
        pokemons: pokemon,
        title: 'Pokemon',
        buttonTitle: 'pokemon',
        types,
        selectedTypes,
        sortOrder,
    });
}

async function getOnePokemon(req, res) {
    const pokemonId = req.params.id;
    const pokemons = await db.getAllPokemon();
    const targetPokemon = pokemons.find(pokemon => String(pokemon.id) === pokemonId);
    if (!targetPokemon) {
        return res.status(404).send('Pokémon not found');
    }
    const result = await db.getTrainersToPokemon(pokemonId) || { trainers: [] };

    res.render('onePokemon', {
        pokemon: targetPokemon,
        trainers: Array.isArray(result.trainers) ? result.trainers : [],
    });
}


async function addPokemonPOST(req, res) {
    const { name, description} = req.body;
        const types = Array.isArray(req.body.types) ? req.body.types : req.body.types ? [req.body.types] : [];
        let imageUrl = null;

        if (req.file) {
            imageUrl = await uploadImage(req.file.path, 'pokemon');
        }

        const pokemon = await db.insertPokemon({
            name,
            image_path: imageUrl,
            description,
        });

        if (types.length > 0) {
            await db.insertPokemonTypes(pokemon.id, types);
        }

        res.redirect('/pokemon');
}


async function newPokemonFormGET(req, res) {
    const types = await db.getAllTypes();
    res.render('forms/pokemonForm', {types: types})
}


module.exports = {
    getPokemon,
    addPokemonPOST,
    newPokemonFormGET,
    getOnePokemon,
}