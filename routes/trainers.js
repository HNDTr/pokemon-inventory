const {Router} = require('express');
const {getTrainers} = require('../controllers/trainerController')

const trainersRouter = Router();

trainersRouter.get('/', getTrainers)


module.exports = trainersRouter;
