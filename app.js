"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require('jwt-simple');
var path = require('path');
var app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const SECRET = 'mysecret';





/* ===================== 
DEFINITION OF JSON CONTENT
===================== */

var accounts = [];
var account = {};
var account2 = {};
var account3 = {};
account2.forename = "Delia";
account2.surname = "Derbyshire";
account2.username = "doctorwhocomposer";
account2.password = "trenzalore";
account3.forename = "Jack";
account3.surname = "Stride";
account3.username = "jstride";
account3.password = "gucci";
accounts.push(account);
accounts.push(account2);	
accounts.push(account3);

var fights = [];
var fight = {};
var fight2 = {};
fight.username_1 = "cal_johnston";
fight.username_2 = "doctorwhocomposer";
fight.id = "106";
fight.location = "SU";
fight.noOfRounds = "3";
fight2.username_1 = "cal_johnston";
fight2.username_2 = "jstride";
fight2.id = "107";
fight2.location = "NV";
fight2.noOfRounds = "3";
fights.push(fight);
fights.push(fight2);





/* ===================== 
FUNCTIONS RELATING TO LOADING INITIAL WEBSITE
===================== */

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname+'/public/Home.html'));
});






/* ===================== 
FUNCTIONS RELATING TO DISPLAYING INFORMATION IN TABLES
===================== */

// Displays information from JSON file
app.get('/people', function(req, res){
	console.log("Getting all accounts for account table");	
	return res.send(accounts);
});

// Returns information about a particular account from JSON file
app.get('/people/:username', function(req, res){
	console.log("Getting information for account: " + req.params.username);
	for(var i=0; i<accounts.length; i++){
		if(accounts[i].username == req.params.username){
			return res.send(accounts[i]);
		}	
	}
});

// Displays fight information from fights (JSON file)
app.get('/fights', function(req, res){
	console.log("Getting all fights for fight table");
	return res.send(fights);
});





/* ===================== 
FUNCTIONS RELATING TO ADDING A FIGHT
===================== */

// Adds a fight to the fight table (if user is logged in)
app.post('/addfight', passport.authenticate('bearer', {session: false}), function(req, res){
	var result = {};
	var newFight = {};
	newFight.username_1 = req.body.username_1;
	newFight.username_2 = req.body.username_2;
	newFight.id = req.body.id;
	newFight.location = req.body.location;
	newFight.noOfRounds = req.body.noOfRounds;

	fights.push(newFight);
	return res.send(JSON.stringify("Nailed it"));
});



/* ===================== 
FUNCTIONS RELATING TO REGISTRATION OF ACCOUNTS
===================== */

// Creates a new account
app.post('/people', function(req, res){
	var result = {};
	var newAccount = {};
	newAccount.forename = req.body.forename;
	newAccount.surname = req.body.surname;
	newAccount.username = req.body.username;
	newAccount.password = req.body.password;
	result = JSON.stringify("Permission denied - invalid access token")
	res.statusCode = 403;
	if(req.body.access_token == 'concertina'){
		if(!(checkforUsername(newAccount.username))){
			result = JSON.stringify("Account successfully added: " + newAccount.username);
			accounts.push(newAccount);
			res.statusCode = 200;
		}else{
			result = JSON.stringify("Account not created - Username already exists");
			res.statusCode = 400;
		}
	}
	return res.send(result);
});






/* ===================== 
FUNCTIONS RELATING TO LOGIN & AUTHENTICATION
===================== */

// Logs someone in to their account (assuming they have valid information)
app.post('/login', passport.authenticate('local', {session: false}), function(req, res){
	return res.send({token: req.user});
});

// Creates a unique token for a particular login session
passport.use(new LocalStrategy((username, password, done) => {
	var position = findUsername(username);
	if(!(position == -1)){
		if(accounts[position].password == password){
			done(null, jwt.encode({username}, SECRET));
			return;
		}
	}
	done('null', false);
}));

// Validates the current token with the current login
passport.use(new BearerStrategy((token, done) => {
	try{
		const { username } = jwt.decode(token, SECRET);
		if(username === "cal_johnston"){
			done(null, username);
			return;
		}
		done(null, false);
	} catch(error){
		done(null, false);
	}
}));

function checkforUsername(username){
	for(var i=0; i<accounts.length; i++){
		if(accounts[i].username == username){
			return true;
		}
	}
	return false;
}

function findUsername(username){
	for(var i=0; i<accounts.length; i++){
		if(accounts[i].username == username){
			return i;
		}
	}
	return -1;
}

module.exports = app;