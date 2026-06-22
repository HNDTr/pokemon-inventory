const db = require('../db/queries');

async function getTrainers(req, res){
    const trainers = await db.getAllTrainers();
    res.render('trainers', {trainers: trainers, title: 'Trainers', buttonTitle: 'trainer'});
}

module.exports = {
    getTrainers,
}