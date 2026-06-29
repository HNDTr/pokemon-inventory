const db = require('../db/queries');
const { uploadImage } = require('../db/cloudinary/queries');


async function getTrainers(req, res){
    const sortOrder = req.query.sort === 'desc' ? 'desc' : 'asc';
    const trainers = await db.getAllTrainers({sort: sortOrder});
    res.render('trainers',{
    trainers: trainers, 
    title: 'Trainers', 
    buttonTitle: 'trainer',
    sortOrder: sortOrder
});
}

async function addTrainerPOST(req, res) {
    const { name, description} = req.body;
    const pokemon = Array.isArray(req.body.pokemon) ? req.body.pokemon : req.body.pokemon ? [req.body.pokemon] : [];
    let imageUrl = null;

    if (req.file) {
        imageUrl = await uploadImage(req.file.path, 'trainers');
    }

    const trainer = await db.insertTrainer({
        name,
        image_path: imageUrl,
        description,
    });

    if (pokemon.length > 0) {
        await db.insertTrainerPokemon(trainer.id, pokemon);
    }

    res.redirect('/trainers');
}


async function newTrainerFormGET(req, res) {
    const pokemon = await db.getAllPokemon();
    res.render('forms/trainerForm', {pokemons: pokemon, trainer: null})
}

async function getOneTrainer(req, res) {
    const trainer_id = req.params.id;
    const trainers = await db.getAllTrainers();
    const targetTrainer = trainers.find(trainer => String(trainer.id) === trainer_id);
    if (!targetTrainer) {
        return res.status(404).send('Trainer not found');
    }
    const result = await db.getPokemonToTrainer(trainer_id) || { pokemon: [] };

    res.render('oneTrainer', {
        trainer: targetTrainer,
        pokemon: Array.isArray(result.pokemon) ? result.pokemon : [],
    });
}

async function editTrainerGET(req, res) {
    const trainerId = req.params.id;
    const trainers = await db.getAllTrainers();
    const pokemon = await db.getAllPokemon();
    const targetTrainer = trainers.find(trainer => String(trainer.id) === trainerId);
    // console.log(targetTrainer)
    const trainerPokemon = await db.getPokemonToTrainer(targetTrainer.id);
    // console.log(trainerPokemon)
    res.render('forms/trainerForm', {trainer: targetTrainer, pokemons: pokemon, trainerPokemon: trainerPokemon});
}   

async function editTrainerPUT(req, res) {
    const trainer_id = req.params.id;
    const { name, description} = req.body;
    const pokemon = Array.isArray(req.body.pokemon) ? req.body.pokemon : req.body.pokemon ? [req.body.pokemon] : [];

    await db.editTrainer({trainer_id, name, description})

    if (pokemon.length > 0) {
        await db.insertTrainerPokemon(trainer_id, pokemon);
    }


    res.redirect(`/trainers/${trainer_id}`)
}

module.exports = {
    getTrainers,
    newTrainerFormGET,
    addTrainerPOST,
    getOneTrainer,
    editTrainerGET,
    editTrainerPUT
}