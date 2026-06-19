const express = require('express');
const app = express();
const path = require('node:path');

const indexRouter = require('./routes/index');
const pokemonRouter = require('./routes/pokemon')


// template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// asset files
const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));
app.use(
  '/bootstrap',
  express.static(
    path.join(__dirname, 'node_modules/bootstrap/dist')
  )
);

// SETUP

app.use(express.urlencoded({extended: true}));

// routes
app.use('/', indexRouter)
app.use('/pokemon', pokemonRouter)
// app.use('/types')
// app.use('/trainers')




const PORT = 3000;
app.listen(PORT, (err) => {
    if (err) {
        throw error
    }
    console.log(`Pokemon inventory server started - listening on port ${3000}`);
})