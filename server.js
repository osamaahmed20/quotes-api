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
        let q = 'SELECT * FROM quotes WHERE year = ' + req.query.year;
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
    let q = 'SELECT * FROM quotes WHERE rowid = ?';
    db.get(q, [req.params.id], function(err, row){
        if(err){
            res.send(err.message);
        }
        else{
            console.log("Return quote with id: " + req.params.id);
            res.json(row)
        }
    });
});

app.post('/quotes', function(req, res){
    let q = 'INSERT INTO quotes VALUES (?, ?, ?)';
    db.run(q, [req.body.quote, req.body.author, parseInt(req.body.year)], function(err){
        if(err){
            res.send(err.message);
        }
        else{
            console.log('Inserted quote to database');
            res.send('Inserted quote to database.');
        }
    });
});

app.listen(port, function(){
    console.log('Listening on port ' + port);
});