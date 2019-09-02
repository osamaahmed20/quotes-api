var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('quotes.db');

var port = 3000;

app.get('/', function(request, response){
    response.send('Get request received at /');
});

app.get('/quotes', function(req, res){
    if(req.query.year){
        q = 'SELECT * FROM quotes WHERE year = ' + req.query.year;
        db.all(q, function(err, rows){
            if(err){
                res.send(err.message);
            }
            else{
                console.log("Return a list of quotes from the year: " + req.query.year);
                res.json(rows);
            }
        });
    }
    else{
        db.all('SELECT * FROM quotes', function(err, rows){
            if(err){
                res.send(err.message);
            }
            else{
                console.log("Return a list of all quotes");
                res.json(rows);
            }
        });
    }
});

app.get('/quotes/:id', function(req, res){
    console.log("return quote with the ID: " + req.params.id);
    res.send("Return quote with the ID: " + req.params.id);
});

app.post('/quotes', function(req, res){
    console.log("Insert a new quote: " + req.body.quote);
    res.json(req.body);
});

app.listen(port, function(){
    console.log('Listening on port ' + port);
});