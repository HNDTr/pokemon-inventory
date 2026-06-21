const db = require('../db/queries');

async function getPokemon(req, res) {
    const pokemon = await db.getAllPokemon();
    res.render('pokemon', {pokemons: pokemon});
}

async function addPokemonPOST(req, res) {

}

async function newPokemonFormGET(req, res) {
    const types = await db.getAllTypes();
    res.render('forms/pokemonForm', {types: types})
}


module.exports = {
    getPokemon,
    newPokemonFormGET,
}