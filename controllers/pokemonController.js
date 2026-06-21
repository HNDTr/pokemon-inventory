const db = require('../db/queries');

async function getPokemon(req, res) {
    const pokemon = await db.getAllPokemon();
    res.render('pokemon', {pokemons: pokemon});
}

async function addPokemon(req, res) {

}


module.exports = {
    getPokemon
}