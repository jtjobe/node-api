// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// connect to MongoDB database
mongoose.connect('mongodb://localhost/apiDB');

// pull in Bear model
var Bear = require('./app/models/bear');

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware function to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here


// routes that end in /bears 
// ============================================
router.route('/bears')

  // create a bear 
  .post(function(req, res) {

    var bear = new Bear(); // create a new instance of the Bear model
    bear.name = req.body.name; // set the bears name (comes from the request)

    // save the bear and check for errors
    bear.save(function(err) {

      if(err)
        res.send(err);

      res.json({ message: 'Bear created!' });

    });

  })

  // get all the bears
  .get(function(req, res) {

    Bear.find(function(err, bears) {
      if (err)
        res.send(err);

      res.json(bears);
    });

  });


// routes that end in /bears/:id
// ============================================

router.route('/bears/:id')

  // get a specific bear
  .get(function(req, res) {

    Bear.findById(req.params.id, function(err, bear) {
      if (err)
          res.send(err);
      res.json(bear);
    });
  })

  // update bear with this id
  .put(function(req, res) {
   
    Bear.findById(req.params.id, function(err, bear) {

      if (err)
          res.send(err);

      bear.name = req.body.name; // update the bears name

      // save the bear
      bear.save(function(err) {
        if (err)
          res.send(err);

        res.json({ message: 'Bear updated!' })
      });
    });
  })

  .delete(function(req, res) {

    Bear.remove({
      _id: req.params.id
    }, function(err, bear) {
      if (err)
        res.send(err);

      res.json({ message: 'Succesfully deleted' })
    });
  });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);