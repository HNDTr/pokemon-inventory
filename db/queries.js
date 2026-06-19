const pool = require('./pool');

// get all pokemon
async function getAllPokemon(){
    const {rows} = await pool.query('SELECT * FROM pokemon')
    return rows
}

// get one pokemon 

// insert pokemon 

// search pokemon





// get all types 

// get pokemons on types 



// get all trainers

// get pokemons on trainers


module.exports = {
    getAllPokemon,
}