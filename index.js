var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// to generate random ids
var crypto = require("crypto");

var redis = require('redis');
var client = redis.createClient(6379, 'localhost', {no_ready_check: true});
client.auth('password', function (err) {
    if (err) throw err;
});

if (process.argv.length < 3) {
    console.log("Usage: " + __filename + " HUB_PASSWORD");
    process.exit(-1);
} else {
    var admin_password = process.argv[2];
}

// To check the admin password
function check_admin_promise(given_pw){
  var promise = new Promise(function(resolve, reject){
    client.get("ADMIN_PW", function (err, reply){
      if (err){
        reject(err);
      }
      if ((!reply) || given_pw && (given_pw === reply.toString())){
        resolve(true);
      }
      else{
        reject(false);
      }
    })
  });
  return promise
}

// ENDPOINTS

// new service server registry
app.post("/post/services", function(req, res){
    req.body.service
    req.body.host
    var post_service = function(x){
      client.sadd("SERVICES_" + req.body.service, req.body.host, function (err, rep){
        if (err){
          res.sendStatus(500);
        } else {
          client.sadd("SERVICE_SET", req.body.service);
          res.sendStatus(200);
          // TODO make actual result
        }
      })
    }.bind(this);
    check_admin_promise(req.body.admin_password).then(post_service).catch((x)=> (res.send(x)));
});

// new auth proxy
app.post("/post/auth", function(req, res){
    req.body.pubkey
    var post_auth = function(x){
      var id = crypto.randomBytes(5).toString('hex');
      client.set("AUTH_" + id, req.body.pubkey, function (err, rep){
        if (err){
          res.sendStatus(500);
        } else {
          res.send(id)
        }
      })
    }.bind(this);
    check_admin_promise(req.body.admin_password).then(post_auth).catch((x)=> (res.send(x)));

});

// new deployment variable
app.post("/post/variable", function(req, res){
    req.body.name
    req.body.variable
    var post_var = function(x){
      client.set("VARS_" + req.body.name, req.body.variable, function (err, rep){
        if (err){
          res.sendStatus(500);
        } else {
          res.json({name: req.body.name, variable: req.body.variable})
        }
      })
    }.bind(this);
    check_admin_promise(req.body.admin_password).then(post_var).catch((x)=> (res.send(x)));
});

// list of services
app.get("/get/services/all", function(req, res){
    client.smembers("SERVICE_SET", function(err, rsp){
      if(err){
        res.sendStatus(500);
      } else {
        res.json(rsp);
      }
    });
});

// list of services
app.get("/get/services/one/:service", function(req, res){
    client.smembers("SERVICES_" + req.params.service, function(err, rsp){
      if(err){
        res.sendStatus(500);
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
        res.sendStatus(500);
      } else {
        if (rsp){
          res.json({id: req.params.id, key: rsp});
        } else {
          res.sendStatus(404);
        }
      }
    });
});
// get deployment variable
app.get("/get/variables/one/:name", function(req, res){
  client.get("VARS_" + req.params.name, function(err, rsp){
    if(err){
      res.sendStatus(500);
    } else {
      res.json({name: req.params.name, variable: rsp});
    }
  });
});


// listen on port whatever
app.listen(8080);
