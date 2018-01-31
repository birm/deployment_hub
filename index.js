var express = require('express');
var app = express();

// to generate random ids
var crypto = require("crypto");

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('deploymenthub.sq3')
// create tables if they don't exist
function sq3_init(){
    db.run('CREATE TABLE IF NOT EXISTS variables (name TEXT PRIMARY KEY, value TEXT);');
    db.run('CREATE TABLE IF NOT EXISTS services (host TEXT NOT NULL, service TEXT NOT NULL);');
    db.run('CREATE TABLE IF NOT EXISTS proxy (id TEXT PRIMARY KEY, pubkey TEXT);');
    'CREATE UNIQUE INDEX idx_var ON variables (name);'
    'CREATE UNIQUE INDEX idx_proxy ON proxy (id);'
}
sq3_init();

// BIG TODO
// handle database errors with return codes

// ENDPOINTS

// new service server registry
app.post("/new/services", function(req, res){
    let stmt = db.prepare('insert into services values (?, ?);');
    for (let service in req.body.services){
        stmt.run([req.body.host, services[service]]);
    }
    stmt.finalize();
});
// new auth proxy
app.post("/new/auth", function(req, res){
    req.body.host
    req.body.pubkey
    // TODO randomly generate an ID
    let id = crypto.randomBytes(5).toString('hex');
    let stmt = db.prepare('insert into proxy values (?, ?);');
    // TODO handle failure "existing key" by trying again
    stmt.run([id, req.body.pubkey]);
    stmt.finalize();
    // TODO return the id
});
// new deployment variable
app.post("/new/variable", function(req, res){
    let stmt = db.prepare('insert into variables values (?, ?);');
    stmt.run([req.body.name, req.body.variable]);
    stmt.finalize();
});

// new service server registry
app.post("/update/services", function(req, res){
    db.run('begin transaction;');
    db.run('delete from services where host = ?;',[req.body.host] )
    let stmt = db.prepare('insert into services values (?, ?);');
    for (let service in req.body.services){
        stmt.run([req.body.host, services[service]]);
    }
    db.run('commit;');
    stmt.finalize();
});
// new auth proxy
app.post("/update/auth", function(req, res){
    req.body.host
    req.body.pubkey
    let stmt = db.prepare('replace into proxy values (?, ?);');
    // TODO handle failure "existing key" by trying again
    stmt.run([id, req.body.pubkey]);
    stmt.finalize();
    // TODO return the id
});
// new deployment variable
app.post("/update/variable", function(req, res){
    let stmt = db.prepare('replace into variables values (?, ?);');
    stmt.run([req.body.name, req.body.variable]);
    stmt.finalize();
});

// list of services
app.get("/get/services", function(req, res){
    db.all('select * from services;', (err,rows) => (res.json(rows)));
});
// pub key for auth proxy given id
app.get("/get/key/:id", function(req, res){
    db.get('select * from services where id = ?;', [req.params.id], (err,row) => (res.json(row)));
});
// get deployment variable
app.get("/get/variables/one/:name", function(req, res){
    db.get('select * from variables where name = ?;', [req.params.name], (err,row) => (res.json(row)));
});
// get deployment variables
app.get("/get/variables", function(req, res){
    db.all('select * from variables;', (err,rows) => (res.json(rows)));
});


// listen on port whatever
app.listen(8080);
