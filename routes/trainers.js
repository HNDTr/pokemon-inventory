const {Router} = require('express');
const multer = require('multer');
const {getTrainers, newTrainerFormGET, addTrainerPOST, getOneTrainer, editTrainerGET, editTrainerPUT} = require('../controllers/trainerController')

const trainersRouter = Router();
const upload = multer({ dest: 'uploads/' });

trainersRouter.get('/', getTrainers);

trainersRouter.get('/new', newTrainerFormGET);

trainersRouter.get('/:id', getOneTrainer);

trainersRouter.post('/new', upload.single('image'), addTrainerPOST)

trainersRouter.get('/edit/:id', editTrainerGET);

trainersRouter.post('/edit/:id', upload.single('image'), editTrainerPUT);



module.exports = trainersRouter;
