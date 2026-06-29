const pool = require('./pool');

// get all pokemon
async function getAllPokemon({ sort = 'asc', types = [], search = ''} = {}){
    let query = `
        SELECT 
            p.id,
            p.name, 
            p.description,
            p.image_path AS pokemon_image,  
            ARRAY_AGG(t.name) AS types,
            ARRAY_AGG(t.image_path) AS type_images
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


// get all pokemon
async function searchPokemon({search = ''} = {}){
    let query = `
        SELECT 
            p.id,
            p.name, 
            p.description,
            p.image_path AS pokemon_image,  
            ARRAY_AGG(t.name) AS types,
            ARRAY_AGG(t.image_path) AS type_images
        FROM pokemon p
        JOIN pokemon_types pt
            ON p.id = pt.pokemon_id
        JOIN types t
            ON t.id = pt.type_id
    `;
    
    if (search.length > 0) {
        query += `
        WHERE 
            LOWER(p.name) LIKE '%${search}%'
        `
    }

    query += `
        GROUP BY p.id, p.name, p.image_path
        ORDER BY p.name ASC;
    `;

    const {rows} = await pool.query(query);
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
    // 1. remove all old relations
    await pool.query(
        `DELETE FROM pokemon_types WHERE pokemon_id = $1`,
        [pokemonId]
    );

    // 2. if nothing selected, stop here
    if (!Array.isArray(typeNames) || typeNames.length === 0) return;

    // 3. insert new relations
    const sql = `
        INSERT INTO pokemon_types (pokemon_id, type_id)
        SELECT $1, id
        FROM types
        WHERE name = ANY($2)
    `;

    await pool.query(sql, [pokemonId, typeNames]);
}



async function editPokemon({pokemon_id, name, description}) {
    const sql = `
        UPDATE pokemon
        SET name = $1, description = $2
        WHERE id = $3;
    `
    await pool.query(sql, [name, description, pokemon_id]);
}

async function deletePokemon(id){
    await pool.query(`DELETE FROM pokemon WHERE id = $1`, [id]);
}


// search pokemon


// get all types 
async function getAllTypes(){
    const {rows} = await pool.query('SELECT * FROM types');
    return rows;
}

// get all trainers
async function getAllTrainers({sort='asc'} = {}){
    let sql = 'SELECT * FROM trainers';
    const order = sort === 'desc' ? 'DESC' : 'ASC';
    sql += `
        ORDER BY name ${order};
    `;
    const {rows} = await pool.query(sql);
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
    // 1. remove all old relations
    await pool.query(
        `DELETE FROM trainer_pokemon WHERE trainer_id = $1`,
        [trainerId]
    );

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

// get pokemon on trainer
async function getPokemonToTrainer(trainer_id) {
    const SQL = `
        SELECT
            tr.id,
            json_agg(
                json_build_object(
                    'id', p.id,
                    'name', p.name,
                    'image_path', p.image_path
                )
            ) AS pokemon
        FROM trainers tr
        JOIN trainer_pokemon tp
            ON tr.id = tp.trainer_id
        JOIN pokemon p
            ON tp.pokemon_id = p.id
        WHERE tr.id = $1
        GROUP BY tr.id
    `;

    const { rows } = await pool.query(SQL, [trainer_id]);
    return rows[0] || { pokemon: [] };
}

async function editTrainer({trainer_id, name, description}) {
    const sql = `
        UPDATE trainers
        SET name = $1, description = $2
        WHERE id = $3;
    `
    await pool.query(sql, [name, description, trainer_id]);
}


module.exports = {
    getAllPokemon,
    insertPokemon,
    insertPokemonTypes,
    getAllTypes,
    getAllTrainers,
    getTrainersToPokemon,
    insertTrainer,
    insertTrainerPokemon,
    getPokemonToTrainer,
    editPokemon,
    deletePokemon,
    editTrainer,
    searchPokemon
}