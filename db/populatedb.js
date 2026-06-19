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
`

const trainersTable = `
    CREATE TABLE IF NOT EXISTS trainers (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(20) UNIQUE NOT NULL,
        image_path VARCHAR(255)
    );
`


async function main() {
    console.log('Seeding...')

    const client = new Client({
        connectionString: process.env.DB_CONNECTION
    })
    await client.connect();
    await client.query(pokemonTable);
    // await client.query(typesTable);
    // await client.query(trainersTable);
    await client.end();

    console.log('Seeding process completed.')
}

main();