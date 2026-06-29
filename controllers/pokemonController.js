const db = require('../db/queries');
const { uploadImage } = require('../db/cloudinary/queries');
const {body, validationResult, matchedData} = require('express-validator');

async function getPokemon(req, res) {
    const sortOrder = req.query.sort === 'desc' ? 'desc' : 'asc';
    const selectedTypes = [].concat(req.query.types || []).filter(Boolean);
    const types = await db.getAllTypes();
    const search = req.query.search || ""
    let pokemon;
    if (search) {
        pokemon = await db.searchPokemon({ search: search })
    } else {
        pokemon = await db.getAllPokemon({ sort: sortOrder, types: selectedTypes });
    }

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

    return targetPokemon;
}


async function addPokemonPOST(req, res) {
    const { name, description} = req.body;
    const types = Array.isArray(req.body.types) ? req.body.types : req.body.types ? [req.body.types] : [];
    let imageUrl = null;
    console.log("FILE:", req.file);
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
    res.render('forms/pokemonForm', {types: types, pokemon: null})
}

async function editPokemonGET(req, res) {
    const pokemonId = req.params.id;
    const pokemons = await db.getAllPokemon();
    const types = await db.getAllTypes();
    const targetPokemon = pokemons.find(pokemon => String(pokemon.id) === pokemonId);
    // console.log(targetPokemon)
    res.render('forms/pokemonForm', {pokemon: targetPokemon, types: types});
}   

async function editPokemonPUT(req, res) {
    const pokemon_id = req.params.id;
    const { name, description} = req.body;
    const types = Array.isArray(req.body.types) ? req.body.types : req.body.types ? [req.body.types] : [];

    await db.editPokemon({pokemon_id, name, description})

    if (types.length > 0) {
        await db.insertPokemonTypes(pokemon_id, types);
    }


    res.redirect(`/pokemon/${pokemon_id}`)
}

async function deletePokemon(req, res) {
    const pokemon_id = req.params.id;
    // let user_input = prompt('Admin password:')
    // if (user_input === process.env.ADMIN_PASS) {
    await db.deletePokemon(pokemon_id);
    // }
    res.redirect('/pokemon');
}

module.exports = {
    getPokemon,
    addPokemonPOST,
    newPokemonFormGET,
    getOnePokemon,
    editPokemonGET,
    editPokemonPUT,
    deletePokemon
}