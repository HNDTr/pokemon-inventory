const {Router} = require('express');
const multer = require('multer');
const {getTrainers, newTrainerFormGET, addTrainerPOST} = require('../controllers/trainerController')

const trainersRouter = Router();
const upload = multer({ dest: 'uploads/' });

trainersRouter.get('/', getTrainers);

trainersRouter.get('/new', newTrainerFormGET);

trainersRouter.post('/new', upload.single('image'), addTrainerPOST)


module.exports = trainersRouter;
