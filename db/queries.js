const pool = require('./pool');

// get all pokemon
async function getAllPokemon(){
    const pokemonAndTypes = `
        SELECT 
            p.id,
            p.name, 
            p.image_path AS pokemon_image,  
            ARRAY_AGG(t.image_path) AS types
        FROM pokemon p
        JOIN pokemon_types pt
            ON p.id = pt.pokemon_id
        JOIN types t
            ON t.id = pt.type_id
        GROUP BY p.id, p.name;
    `;
    const {rows} = await pool.query(pokemonAndTypes);
    return rows;
}

// get one pokemon 

// insert pokemon 

// search pokemon





// get all types 
async function getAllTypes(){
    const {rows} = await pool.query('SELECT * FROM types');
    return rows;
}

// get pokemons on types 



// get all trainers
async function getAllTrainers(){
    const {rows} = await pool.query('SELECT * FROM trainers');
    return rows;
}

// get pokemons on trainers


module.exports = {
    getAllPokemon,
    getAllTypes,
    getAllTrainers
}