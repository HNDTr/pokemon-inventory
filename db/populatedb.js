const {Client} = require('pg');
require('dotenv').config();

const pokemonTable = `
    CREATE TABLE IF NOT EXISTS pokemon (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(20) UNIQUE NOT NULL,
        image_path VARCHAR(255),
        description TEXT
    );

    INSERT INTO pokemon (name, image_path, description)
    VALUES
        ('Bulbasaur', 'bulbasaur.png', 'It is one of the three first partner Pokémon that can be chosen in Kanto region, along with Squirtle and Charmander.'),
        ('Squirtle', 'squirtle.png', 'It is one of the three first partner Pokémon that can be chosen in Kanto region, along with Bulbasaur and Charmander.') ,
        ('Charmander', 'charmander.png', 'It is one of the three first partner Pokémon that can be chosen in the Kanto region, along with Bulbasaur and Squirtle.');
`

const typesTable = `
    CREATE TABLE IF NOT EXISTS types (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(20) UNIQUE NOT NULL,
        image_path VARCHAR(255)
    );

    INSERT INTO types (name, image_path) 
    VALUES 
        ('Normal', 'normal.png'),
        ('Fire', 'fire.png'),
        ('Fighting', 'fighting.png'),
        ('Flying', 'flying.png'),
        ('Water', 'water.png'),
        ('Grass', 'grass.png'),
        ('Poison', 'poison.png'),
        ('Electric', 'electric.png'),
        ('Ground', 'ground.png'),
        ('Psychic', 'psychic.png'),
        ('Rock', 'rock.png'),
        ('Ice', 'ice.png'),
        ('Bug', 'bug.png'),
        ('Dragon', 'dragon.png'),
        ('Ghost', 'ghost.png'),
        ('Dark', 'dark.png'),
        ('Steel', 'steel.png'),
        ('Fairy', 'fairy.png');
`

const trainersTable = `
    CREATE TABLE IF NOT EXISTS trainers (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(20) UNIQUE NOT NULL,
        image_path VARCHAR(255)
    );

    INSERT INTO trainers (name, image_path) 
    VALUES
        ('Ash Ketchum', 'Ash_Ketchum.png'),
        ('Cynthia', 'Cynthia.png'),
        ('Gary Oak', 'Gary_Oak.png');
`

const pokemonTypesTables = `
    CREATE TABLE IF NOT EXISTS pokemon_types (
        pokemon_id INTEGER NOT NULL,
        type_id INTEGER NOT NULL,

        PRIMARY KEY (pokemon_id, type_id),

        FOREIGN KEY (pokemon_id)
            REFERENCES pokemon(id)
            ON DELETE CASCADE,
        
        FOREIGN KEY (type_id)
            REFERENCES types(id)
            ON DELETE CASCADE
    );

    INSERT INTO pokemon_types (pokemon_id, type_id)
    VALUES
        (1, 6),
        (1, 7),
        (2, 5),
        (3, 2);
`

async function main() {
    console.log('Seeding...')

    const client = new Client({
        connectionString: process.env.DB_CONNECTION
    })
    await client.connect();
    // await client.query(pokemonTable);
    // await client.query(typesTable);
    // await client.query(pokemonTypesTables);
    await client.query(trainersTable);
    await client.end();

    console.log('Seeding process completed.')
}

main();