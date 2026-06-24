const pool = require('./pool');

// get all pokemon
async function getAllPokemon({ sort = 'asc', types = [] } = {}){
    let query = `
        SELECT 
            p.id,
            p.name, 
            p.description,
            p.image_path AS pokemon_image,  
            ARRAY_AGG(t.image_path) AS types
        FROM pokemon p
        JOIN pokemon_types pt
            ON p.id = pt.pokemon_id
        JOIN types t
            ON t.id = pt.type_id
    `;
    const params = [];

    if (Array.isArray(types) && types.length > 0) {
        params.push(types);
        query += `
        WHERE p.id IN (
            SELECT pt2.pokemon_id
            FROM pokemon_types pt2
            JOIN types t2 ON t2.id = pt2.type_id
            WHERE t2.name = ANY($${params.length})
        )
        `;
    }

    const order = sort === 'desc' ? 'DESC' : 'ASC';
    query += `
        GROUP BY p.id, p.name, p.image_path
        ORDER BY p.name ${order};
    `;

    const {rows} = await pool.query(query, params);
    return rows;
}

async function insertPokemon({name, image_path, description}){
    const sql = `
        INSERT INTO pokemon (name, image_path, description)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
    const {rows} = await pool.query(sql, [name, image_path, description]);
    return rows[0];
}


async function insertPokemonTypes(pokemonId, typeNames){
    if (!Array.isArray(typeNames) || typeNames.length === 0) return;

    const sql = `
        INSERT INTO pokemon_types (pokemon_id, type_id)
        SELECT $1, id FROM types WHERE name = ANY($2)
        ON CONFLICT DO NOTHING;
    `;

    await pool.query(sql, [pokemonId, typeNames]);
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

async function insertTrainer({name, image_path, description}){
    const sql = `
        INSERT INTO trainers (name, image_path, description)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
    const {rows} = await pool.query(sql, [name, image_path, description]);
    return rows[0];
}

async function insertTrainerPokemon(trainerId, pokemonNames) {
    if (!Array.isArray(pokemonNames) || pokemonNames.length === 0) return;

    const sql = `
        INSERT INTO trainer_pokemon (trainer_id, pokemon_id)
        SELECT $1, id FROM pokemon WHERE name = ANY($2)
        ON CONFLICT DO NOTHING;
    `;

    await pool.query(sql, [trainerId, pokemonNames]);
}

// get trainers on pokemon
async function getTrainersToPokemon(pokemon_id) {
    const SQL = `
        SELECT
            p.id,
            json_agg(
                json_build_object(
                    'id', tr.id,
                    'name', tr.name,
                    'image_path', tr.image_path
                )
            ) AS trainers
        FROM pokemon p
        JOIN trainer_pokemon tp
            ON p.id = tp.pokemon_id
        JOIN trainers tr
            ON tp.trainer_id = tr.id
        WHERE p.id = $1
        GROUP BY p.id
    `;

    const { rows } = await pool.query(SQL, [pokemon_id]);
    return rows[0] || { trainers: [] };
}


module.exports = {
    getAllPokemon,
    insertPokemon,
    insertPokemonTypes,
    getAllTypes,
    getAllTrainers,
    getTrainersToPokemon,
    insertTrainer,
    insertTrainerPokemon
}