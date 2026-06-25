const {Client} = require('pg');
require('dotenv').config();

const pokemonTable = `
    CREATE TABLE IF NOT EXISTS pokemon (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(20) UNIQUE NOT NULL,
        image_path VARCHAR(255) NOT NULL,
        description TEXT
    );

    INSERT INTO pokemon (name, image_path, description)
    VALUES
        ('Bulbasaur', 'https://res.cloudinary.com/dnib6xgxy/image/upload/v1782047940/bulbasaur_xpfwaq.png', 'It is one of the three first partner Pokémon that can be chosen in Kanto region, along with Squirtle and Charmander.'),
        ('Squirtle', 'https://res.cloudinary.com/dnib6xgxy/image/upload/v1782048188/squirtle_msif40.png', 'It is one of the three first partner Pokémon that can be chosen in Kanto region, along with Bulbasaur and Charmander.') ,
        ('Charmander', 'https://res.cloudinary.com/dnib6xgxy/image/upload/v1782048177/charmander_e94hlb.png', 'It is one of the three first partner Pokémon that can be chosen in the Kanto region, along with Bulbasaur and Squirtle.');
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
        image_path VARCHAR(255) NOT NULL,
        description TEXT
    );

    INSERT INTO trainers (name, image_path, description) 
    VALUES
        ('Ash Ketchum', 'https://res.cloudinary.com/dnib6xgxy/image/upload/v1782328474/Ash_Ketchum_fjhzhd.webp', 'The main protagonist of Pokémon the Series, and the first overall protagonist of the greater Pokémon animated series. He is also the main character of various manga based on the animated series, including The Electric Tale of Pikachu and Ash & Pikachu, and one of the protagonists of Pocket Monsters Diamond & Pearl and Pokémon Journeys.'),
        ('Cynthia', 'https://res.cloudinary.com/dnib6xgxy/image/upload/v1782328471/Cynthia_h7xivs.png', 'An archeologist who is also the Champion of the Sinnoh region''s Pokémon League in Pokémon Diamond, Pearl, Platinum, Brilliant Diamond, and Shining Pearl.'),
        ('Gary Oak', 'https://res.cloudinary.com/dnib6xgxy/image/upload/v1782328486/Gary_Oak_twonfn.webp', 'A major recurring character in Pokémon the Series. He is a Pokémon Researcher from Pallet Town and grandson of Professor Oak. He is a childhood friend of Ash Ketchum and his main rival in the original series.');
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

const trainerPokemonTable = `
    CREATE TABLE IF NOT EXISTS trainer_pokemon (
        trainer_id INTEGER NOT NULL,
        pokemon_id INTEGER NOT NULL,

        PRIMARY KEY (trainer_id, pokemon_id),

        FOREIGN KEY (trainer_id)
            REFERENCES trainers(id)
            ON DELETE CASCADE,
        
        FOREIGN KEY (pokemon_id)
            REFERENCES pokemon(id)
            ON DELETE CASCADE
    );

    INSERT INTO trainer_pokemon (trainer_id, pokemon_id)
    VALUES
        (1, 1),
        (1, 2),
        (1, 3),
        (3, 2);
`

async function main() {
    console.log('Seeding...')

    const client = new Client({
        connectionString: process.env.DB_CONNECTION
    })
    await client.connect();
    await client.query(pokemonTable);
    await client.query(typesTable);
    await client.query(pokemonTypesTables);
    await client.query(trainersTable);
    await client.query(trainerPokemonTable);
    await client.end();

    console.log('Seeding process completed.')
}

main();