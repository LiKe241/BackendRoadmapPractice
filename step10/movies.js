const express = require('express');
const router = express.Router();

const movies = [
  {id: 101, name: 'Fight Club', year: 1999, rating: 8.1},
  {id: 102, name: 'Inception', year: 2010, rating: 8.7},
  {id: 103, name: 'The Dark Knight', year: 2008, rating: 9},
  {id: 104, name: '12 Angry Men', year: 1957, rating: 8.9}
];

// gets the list of all movies and their details
router.get('/', (req, res) => res.json(movies));

// gets the details of the movie with given id
router.get('/:id([0-9]{3})', (req, res) => {
  const currMovie = movies.filter(
    (movie) => movie.id === parseInt(req.params.id)
  );
  if (currMovie.length === 1) {
    res.json(currMovie[0]);
  } else {
    res.status(404);
    res.json({ message: 'movie ' + req.params.id + ' not found'});
  }
});

// creates a new movie with the details provided
// response contains the URI for this newly created resource
router.post('/', (req, res) => {
  if (!req.body.name
      || !req.body.year.toString().match(/^\d{4}$/g)
      || !req.body.rating.toString().match(/^\d\.\d$/g)) {
    res.status(400);
    res.json({ message: 'bad request' });
  } else {
    const newId = movies[movies.length - 1].id + 1;
    movies.push({
      id: newId,
      name: req.body.name,
      year: req.body.year,
      rating: req.body.rating
    });
    res.json({ message: 'new movie added', location: '/movies/' + newId });
  }
});

// modifies movie with given id(creates one if it doesn't already exist)
// response contains the URI for this newly created resource
router.put('/:id', (req, res) => {
  if (!req.body.name
      || !req.body.year.toString().match(/^\d{4}$/g)
      || !req.body.rating.toString().match(/^\d\.\d$/g)) {
    res.status(400);
    res.json({ message: 'bad request' });
  } else {
    const indexToUpdate =
      movies.map(movie => movie.id).indexOf(parseInt(req.params.id));
    if (indexToUpdate === -1) {
      // given id doesn't exist, creates new record
      movies.push({
        id: req.params.id,
        name: req.body.name,
        year: req.body.year,
        rating: req.body.rating
      });
      res.json({
        message: 'new movie created',
        location: '/movies' + req.params.id
      });
    } else {
      // given id exists, updates it
      movies[indexToUpdate] = {
        id: req.params.id,
        name: req.body.name,
        year: req.body.year,
        rating: req.body.rating
      };
      res.json({
        message: 'movie id ' + req.params.id + ' updated',
        location: '/movies/' + req.params.id
      });
    }
  }
});

// Movie with given should be deleted, if it exists
// response should contain the status of the request
router.delete('/:id', (req, res) => {
  const indexToRemove =
    movies.map(movie => movie.id).indexOf(parseInt(req.params.id));
  if (indexToRemove === -1) {
    res.json({ message: 'move ' + req.params.id +' not found' });
  } else {
    movies.splice(indexToRemove, 1);
    res.send({ message: 'movie ' + req.params.id + ' removed' });
  }
});

module.exports = router;
