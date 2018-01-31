# deployment_hub
Deployment Info Server

On run, it outputs a admin password required to add variables, auth proxy keys, or services

## Requires
* Redis
* npm
* node

## Endpoints
### /post/services
Add an association between a server and a host.
#### Fields:
* service
* host
* admin_password
#### Returns:
200 if ok, 401 if not authorized
### /post/auth
Add a key for a authentication/api node
#### Fields:
* pubkey
* admin_password
#### Returns:
200 with assigned id if ok, 401 if not authorized
### /post/variable
Add a variable
#### Fields:
* name
* variable
* admin_password
#### Returns:
200 if ok, 401 if not authorized
### /get/services/all
Get a list of all avaliable services
### /get/services/one/{service}
Get a list of hosts offering the given service
### /get/key/{id}
Get the public key for the id, used to confirm the veracity of requests.
### /get/variables/one/{name}
Get the value of a variable set
