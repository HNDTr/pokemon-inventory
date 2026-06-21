const db = require('../db/queries');
const { uploadImage } = require('../db/cloudinary/queries');
const {body, validationResult, matchedData} = require('express-validator');

// const validateFormInputs = [
//     body('name')
//         .trim()
//         .notEmpty().withMessage('Name is required.')
//         .isAlpha('en-US', { ignore: ' ' }).withMessage('Name must only contain letters.')
//         .isLength({ min: 2, max: 20 }).withMessage('Name must be between 2 and 20 characters.'),

//     body('types')
//         .custom(value => {
//             if (Array.isArray(value)) {
//                 return value.length > 0;
//             }
//             return typeof value === 'string' && value.trim().length > 0;
//         })
//         .withMessage('Please select at least one type.'),
// ]

async function getPokemon(req, res) {
    const pokemon = await db.getAllPokemon();
    res.render('pokemon', {pokemons: pokemon});
}


// const addPokemonPOST = [
//     ...validateFormInputs,
//     async (req,res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).render("forms/pokemonForm", {
//                 errors: errors.array(), 
//             })
//         }
//         const { name, description, types } = matchedData(req);
//         // const types = Array.isArray(req.body.types) ? req.body.types : req.body.types ? [req.body.types] : [];
//         let imageUrl = null;

//         if (req.file) {
//             imageUrl = await uploadImage(req.file.path);
//         }

//         const pokemon = await db.insertPokemon({
//             name,
//             image_path: imageUrl,
//             description,
//         });

//         if (types.length > 0) {
//             await db.insertPokemonTypes(pokemon.id, types);
//         }

//         res.redirect('/pokemon');
//     } 
// ]

async function addPokemonPOST(req, res) {
    const { name, description} = req.body;
        const types = Array.isArray(req.body.types) ? req.body.types : req.body.types ? [req.body.types] : [];
        let imageUrl = null;

        if (req.file) {
            imageUrl = await uploadImage(req.file.path);
        }

        const pokemon = await db.insertPokemon({
            name,
            image_path: imageUrl,
            description,
        });

        if (types.length > 0) {
            await db.insertPokemonTypes(pokemon.id, types);
        }

        res.redirect('/pokemon');
}


async function newPokemonFormGET(req, res) {
    const types = await db.getAllTypes();
    res.render('forms/pokemonForm', {types: types})
}


module.exports = {
    getPokemon,
    addPokemonPOST,
    newPokemonFormGET,
}