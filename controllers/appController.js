const chalk = require('chalk');
const cocoLib = require('../lib/lib');
const codecController = require('./codecController');
let userAction = '';
let userCodec = '';
let userInput = '';
let userInputIsFile = false;

const cocoAction = {
  handleInput: (userArgs) => {
    //TODO: Remove switches from userArgs, if they exist
    //Store the user specified action 
    userAction = userArgs[0];
    userCodec = userArgs[1];
    userInput = userArgs[2];
    //If action is unsupported, show error.
    if(actionMap[userAction] === undefined){
      return showError(userAction, "action");
    }
    else{
      //Action is supported, run handler. If there is shared code, run the common first.
      actionMap[userAction](userArgs);
    }
  },

  codecCommon: (userArgs) => {
    //If codec is unsupported, show error.
    if(codecController.format[userCodec] === undefined){
      return showError(userCodec, 'codec');
    }
    //Check to see if input argument is a file
    if(cocoLib.fileExists(userInput)){
      userInputIsFile = true;
      userInput = cocoLib.getFile(userInput);
    }

    //Run handler for actual action.
    cocoAction[userAction](userArgs);
  },
  encode: () => {
    console.log();
    codecController.format[userCodec](true, userInput);
  },
  decode: () => {
    console.log();
    codecController.format[userCodec](false, userInput);
  },
  help: () => {
    console.log('');
    console.log(chalk.yellow('Usage: coco <action> <codec> <input>'));
    console.log(chalk.yellow('    <action> is one of:'));
    console.log(chalk.yellow('        encode, decode'));
    console.log(chalk.yellow('    <codec> is one of:'));
    console.log(chalk.yellow('        jwt, , base64, hex, uri, binary, ascii'));
    console.log(chalk.yellow('    <input> can either be a directory, or a string'));
  }
};

const showError = function(input, name){
  if(input === undefined){
    console.log(chalk.red('You must provide a %s. See \'coco help\'.'), name);

  }
  else{
    console.log(chalk.red('\'%s\' is not a recognized coco %s. See \'coco help\'.'), input, name);
  }
};

const actionMap = {
  "encode": cocoAction.codecCommon,
  "decode": cocoAction.codecCommon,
  "help": cocoAction.help,
  "-h": cocoAction.help,
};

module.exports = cocoAction;
