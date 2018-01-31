var chakram = require('chakram');
const fs = require('fs');
// TESTS
var host = "localhost";
var port = "8080";
var apw = fs.readFileSync('dh_pw.out').toString();

var auth_node_id=""; // need to keep track of what key to look for

describe ("POST Methods", function(){
  it("Should fail without admin password", function(){
    var body = {
      admin_password:1,
      service: "Suspect",
      host: "evil:2001"
    }
    var response = chakram.get(`${host}:${port}/post/services`, body);
    expect(response).to.have.status(401);
  }
  it("Should be able to post a service", function(){
    var body = {
      admin_password:apw,
      service: "Suspect",
      host: "evil:2001"
    }
    var response = chakram.get(`${host}:${port}/post/services`, body);
    expect(response).to.have.status(200);
  }
  it("Should be able to post a key", function(){
    var body = {
      admin_password: apw,
      pubkey: "notreal"
    }
    var response = chakram.get(`${host}:${port}/post/auth`, body);
    expect(response).to.have.status(200);
    // TODO we need to keep track of returned id in auth_node_id for get test
  }
  it("Should be able to post a variable", function(){
    var body = {
      admin_password: apw,
      name: "Posted",
      variable: "true"
    }
    var response = chakram.get(`${host}:${port}/post/variable`, body);
    expect(response).to.have.status(200);
  }
});
// TODO finish
/**
describe ("GET Methods", function(){
  var response = chakram.get(`${host}:${port}/get/services/all`);
  var response = chakram.get(`${host}:${port}/get/services/one/:service`);
  var response = chakram.get(`${host}:${port}/get/key/:id`);
  var response = chakram.get(`${host}:${port}/get/variables/one/:name`);
});
**/
