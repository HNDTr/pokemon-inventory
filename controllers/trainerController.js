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
    res.render('forms/trainerForm', {pokemons: pokemon})
}

module.exports = {
    getTrainers,
    newTrainerFormGET,
    addTrainerPOST
}