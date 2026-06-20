const {Router} = require('express');
const {getAllTypes} = require('../controllers/typesController')

const typesRouter = Router();

typesRouter.get('/', getAllTypes)


module.exports = typesRouter;
