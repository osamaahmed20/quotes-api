/**
 * A basic REST API that stores, retrieves, and deletes quotes. Each quote will have the following information associated with it:
 * id: a unique number to reference the quote
 * quote: a string containing the quote itself
 * author: a string containing the author's name
 * year: the year the quote was recorded or discovered
 */

// imports
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('quotes.db');

// mounts BodyParser as middleware
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 3000;

// ROUTES
/* 
** Acknowledges that request for home page has been recieved.
*/
app.get('/', function(request, response){
    response.send('Get request received at /');
});

/*
** Returns quotes specified by the year query string. 
** If no year specified then return all quotes
** Quotes are returned as JSON
** Ex: home/quotes returns all quotes
** Ex: home/quotes=1900 return quotes from year 1900
*/
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

/*
** Returns quote specified by id. 
** Quotes are returned as JSON
** Ex: home/quotes/:1 return the quote with id=1
*/
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

/*
** Adds quote, author, and year as an entry to database.
*/
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

/*
** Deletes quote entry in database by id. 
** Notice that id does not correspond to the number of quotes in database presently.
** Each quote entry assigned an id when added and id is unaffected by deleting. 
*/
app.delete('/quotes/:id', function(req, res){
    let q = 'DELETE FROM quotes WHERE rowid = ?';
    db.run(q, [req.params.id], function(err){
        if(err){
            res.send(err.message);
        }
        else{
            console.log('Deleted quote with id: ' + req.params.id);
            res.send('Deleted quote with id:' + req.params.id);
        }
    });
});

app.listen(port, function(){
    console.log('Listening on port ' + port);
});