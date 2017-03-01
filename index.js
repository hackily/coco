#! /usr/bin/env node
const main = require('./controllers/appController');

//Grab user provided arguments
const userArgs = process.argv.slice(2);
//Convert string input to lowercase
const lowerArgs = userArgs.map((item) => {
  return item.toLowerCase();
});

if(process.env.NODE_ENV === 'development'){
  console.log('User Args are: ' + lowerArgs); //TODO: Remove log after dev.
}

try{
  main.handleInput(userArgs);
} catch(e){
  if(process.env.NODE_ENV === 'development'){
    console.log(e);
  }
  console.log(e);
}



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