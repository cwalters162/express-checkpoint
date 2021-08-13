const express = require('express');
const knex = require('knex')(require('./knexfile.js')['development']);

const app = express();
const port = 3000;
//const PORT = process.env.PORT || 3000;
app.use(express.json()) // for parsing application/json

app.get('/', function(req, res) {
    res.status(200).send("This is the movie API please use /movies for a list of movies")
  });

app.get('/movies', function(req, res) {
  let title = req.query.title
  if (title === undefined){
    knex
      .select('*')
      .from('movies')
      .then(data => res.status(200).json(data))
      .catch(err =>
        res.status(404).json({
         message:
            'The data you are looking for could not be found. Please try again'
        })
      );
  }
  else {
    knex
     .select('*')
     .from('movies')
     .where('title', title)
     .then(results => {
      if(results.length === 0){
        res.status(404).send(`Movie not found with title of ${title}.`)
      }
      else {res.status(200).send(results)}
    })
  }
});

app.get('/movies/:id', function(req, res) {
  let id = parseInt(req.params.id);
  //console.log("type of id: ", typeof id, "type of number: ", typeof 0)

  if (isNaN(id) === true) {
    res.status(400).send("Not a valid id. Please use an integer.")
  }
  else {
    knex('movies').where('id', id).then(results => {
      if(results.length === 0){
        res.status(404).send(`Movie not found with id of ${id}.`)
      }
      else {res.status(200).send(results)}
    })
  }
});

app.post('/movies', function(req, res) {
  console.log(req.body);
  knex('movies').insert(req.body)
  .then(() => res.status(200).send('movie was sent'))
  .catch(err => {
    return res.status(500).send(err);
  });

});

app.listen(3000, () => {
  console.log(`Yo dawg call me up on dat sweet port: ${port}`)
})