var express = require("express");
var bodyParser = require('body-parser');
var Note = require('./libs/model/note.js');
var mongoose = require("mongoose");
var app = express();

mongoose.connect("mongodb://localhost:27017/officedog");
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.on('connected', function(){
    console.log("Mongoose connected to localhost:27017/officedog");
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var router = express.Router();

router.route('/notes').get(function(req, res){
    Note.find({}, function(err, data){
        if(err) throw err;
        res.json(data);
    });
}).post(function(req, res){
    var note = new Note({
        datetime: new Date(),
        note: req.body.note
    });
    note.save(function(err, note){
        if(err) throw err;
        res.json(note);
    });
});

router.route('/notes/:id').delete(function(req, res){
    Note.findById(req.params.id, function(err, note){
        if(err) res.status(500).send(err);
        note.remove(function(err, note){
            if(err) res.status(500).send(err);
            res.status(200).end();
        });
    });
});

app.use('/api', router);

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(404).send("Not Found");
});

var server = app.listen(3000, function(){
   console.log("Server listening on port %d", server.address().port);
});