#! /usr/bin/env node
const main = require('./controllers/appController');
let chalk = require('chalk');
const cocoLib = require('./lib/lib');

//Grab user provided arguments
const userArgs = process.argv.slice(2);

const lowerArgs = userArgs.map((item) => {
  return item.toLowerCase();
});

console.log('User Args are: ' + lowerArgs); //TODO: Remove log after dev.

const actionObj = {
  "encode": "encode",
  "decode": "decode",
  "foo": main.help,
  "help": main.help,
  "-h": main.help
};
const action = userArgs[0];
//If action is supported, do action. Else, show help.
if(actionObj[action]){
  actionObj[action]();
}

//cmd[userArgs[0]];

/**
 * App requirements
 * Decode hex into RGB, also uses chalk module to show color
 * Encode RGB into hex, use chalk module to show color
 * Warn users if their console doesn't support full color.
 * 
 * Decode JWT. Also an option to create a json file, save into that.
 * Encode JWT, requires you to pass in a signature
 * Encode into Base64
 * Decode Base64 to plain text
 * 
 */