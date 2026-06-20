const db = require('../db/queries');

async function getAllTypes(req, res){
    const types = await db.getAllTypes();
    res.render('types', {types: types});
}


module.exports = {
    getAllTypes
}