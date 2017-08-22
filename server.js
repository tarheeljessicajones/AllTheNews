// dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request'); 
var cheerio = require('cheerio');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

//DB connection
mongoose.connect('mongodb://localhost/hwscraper');

var db = mongoose.connection;
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function() {
  console.log('Mongoose connection successful.');
});

var Note = require('./models/Note.js');
var Article = require('./models/Article.js');


// Routes
app.get('/', function(req, res) {
  res.send(index.html);
});

// GET from NYTimes
app.get('/scrape', function(req, res) {
  request('http://www.nytimes.com/', function(error, response, html) {
    var $ = cheerio.load(html);
    	$('.story').each(function(i, element) {
				var result = {};
				result.title = $(this).children('.story-heading').text();
				result.link = $(this).children('a').attr('href');
				result.blurb = $(this).children('.summary').text();
				var entry = new Article (result);
				entry.save(function(err, doc) {
				  if (err) {
				    console.log(err);
				  } 
				  else {
				    console.log(doc);
				  }
				});


    });
  });
  console.log("Scraped");
  res.redirect("/index.html");
});

//GET from mongoDB
app.get('/articles', function(req, res){
	Article.find({}, function(err, doc){
		if (err){
			console.log(err);
		}
		else {
			res.json(doc);
		}
	});
});

// GET by ObjectId
app.get('/articles/:id', function(req, res){
	Article.findOne({'_id': req.params.id})
	.populate('note')
	.exec(function(err, doc){
		if (err){
			console.log(err);
		} 
		else {
			res.json(doc);
		}
	});
});


//POST
app.post('/articles/:id', function(req, res){
	var newNote = new Note(req.body);

	newNote.save(function(err, doc){
		if(err){
			console.log(err);
		} 
		else {
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			.exec(function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.send(doc);
				}
			});
		}
	});
});


app.listen(3000, function() {
  console.log('App running on port 3000!');
});