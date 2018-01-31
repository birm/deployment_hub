var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// to generate random ids
var crypto = require("crypto");

var redis = require('redis');
var client = redis.createClient(6379, 'localhost', {no_ready_check: true});
client.auth('password', function (err) {
    if (err) throw err;
});

// admin password
let admin_password = crypto.randomBytes(10).toString('hex');
client.set("ADMIN_PW", admin_password, redis.print);
console.info(admin_password);

// To check the admin password
function check_admin_pomise(given_pw){
  var promise = new Promise(function(resolve, reject){
    client.get("ADMIN_PW", function (err, reply){
      if (err){
        reject (err);
      }
      if (given_pw && (given_pw === reply.toString())){
        resolve(true);
      }
      else{
        reject (false);
      }
    })
  });
  return promise
}

function handle_reject(){
  res.send(401);
}

// ENDPOINTS

// new service server registry
app.post("/post/services", function(req, res){
    req.body.service
    req.body.host
    var post_service = function(x){
      client.sadd("SERVICES_" + req.body.service, req.body.host, function (err, rep){
        if (err){
          res.send(500);
        } else {
          client.sadd("SERVICE_SET", req.body.service);
          res.send(200);
          // TODO make actual result
        }
      })
    }.bind(this);
    check_admin_pomise(req.body.admin_password).then(post_service, handle_reject);
});

// new auth proxy
app.post("/post/auth", function(req, res){
    req.body.pubkey
    var post_auth = function(x){
      let id = crypto.randomBytes(5).toString('hex');
      client.set("AUTH_" + id, req.body.pubkey, function (err, rep){
        if (err){
          res.send(500);
        } else {
          res.send(200);
          // TODO make actual result
        }
      })
    }.bind(this);
    check_admin_pomise(req.body.admin_password).then(post_auth, handle_reject);

});

// new deployment variable
app.post("/post/variable", function(req, res){
    req.body.name
    req.body.variable
    var post_var = function(x){
      client.set("VARS_" + req.body.name, req.body.variable, function (err, rep){
        if (err){
          res.send(500);
        } else {
          res.send(200);
          // TODO make actual result
        }
      })
    }.bind(this);
    check_admin_pomise(req.body.admin_password).then(post_service, handle_reject);
});

// list of services
app.get("/get/services/all", function(req, res){
    client.smembers("SERVICE_SET", function(err, rsp){
      if(err){
        res.send(500);
      } else {
        res.json(rsp);
      }
    });
});
// pub key for auth proxy given id
app.get("/get/key/:id", function(req, res){
    req.params.id
    client.get("AUTH_" + req.params.id, function(err, rsp){
      if(err){
        res.send(500);
      } else {
        res.json(rsp);
      }
    });
});
// get deployment variable
app.get("/get/variables/one/:name", function(req, res){
  client.get("VARS_" + req.params.id, function(err, rsp){
    if(err){
      res.send(500);
    } else {
      res.json(rsp);
    }
  });
});


// listen on port whatever
app.listen(8080);
