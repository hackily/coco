const chalk = require('chalk');
const cocoLib = require('../lib/lib');
const codecController = require('./codecController');
const help = require('./helpController');
let userInputIsFile = false;

const cocoAction = {
  handleInput: (userArgs) => {
    let splitArgs = {
      userArgs: [],
      switches: [],
      userAction: '',
      userCodec: '',
      userInput: '',
      userOption: '',
      isHelp: false,
      toFile: false,
      saveDir: '',
      // readDir: ''
    };
    //Process switches
    for(let n = 0; n < userArgs.length; n++){
      let item = userArgs[n];
      if(item === '-h' || item === '--help'){
        splitArgs.isHelp = true;
        continue;
      }
      if(item === '-s' || item === '--save'){
        splitArgs.toFile = true;
        if(!cocoLib.isDir(userArgs[n+1])){
          return showError(undefined, "directory");
        } 
        n++;
        splitArgs.saveDir = userArgs[n];
        continue;
      }
      // if(item === '-r' || item === '--read'){
      //   splitArgs.readFile = true;
      //   if(!cocoLib.isDir(userArgs[n+1])){
      //     return showError(undefined, "directory");
      //   } 
      //   n++;
      //   splitArgs.readDir = userArgs[n];
      //   splitArgs.userInput = cocoLib.readFile(splitArgs.readDir);
      //   continue;
      // }
      //Store all switches
      if(item.charAt(0) === '-'){
        return splitArgs.switches.push(item);
      }
      //If it's not a switch, it's a normal argument
      splitArgs.userArgs.push(item);
    }

    //Store the user specified action 
    splitArgs.userAction = splitArgs.userArgs[0];
    splitArgs.userCodec = splitArgs.userArgs[1];
    splitArgs.userInput = splitArgs.userArgs[2];
    splitArgs.userOption = splitArgs.userArgs[3];

    if(!splitArgs.userAction || splitArgs.userAction === 'help'){
      return help.help();
    }
    //If action isn't mapped to a supported value, show error.
    if(!actionMap[splitArgs.userAction]){
      return showError(splitArgs.userAction, "action");
    }
    //If help is requested, and codec and input are undefined, display action help.
    if(splitArgs.isHelp && splitArgs.userCodec === undefined && splitArgs.userInput === undefined){
      return help.actionHelp[splitArgs.userAction]();
    }
    else{
      //Action is supported, run handler. If there is shared code, run the common first.
      actionMap[splitArgs.userAction](splitArgs);
    }
  },

  codecCommon: (splitArgs) => {
    //If codec is unsupported, show error.
    if(codecController.format[splitArgs.userCodec] === undefined){
      return showError(splitArgs.userCodec, 'codec');
    }
    //If there is no input...
    if(splitArgs.userInput === undefined){
      if(splitArgs.isHelp){
        return help.codecHelp[splitArgs.userCodec]();
      }
      else{
        return showError(splitArgs.userInput, 'input');
      }
    }
    //Check to see if input argument is a file
    if(cocoLib.fileExists(splitArgs.userInput)){
      userInputIsFile = true;
      splitArgs.userInput = cocoLib.readFile(splitArgs.userInput);
    }

    //Run handler for actual action.
    cocoAction[splitArgs.userAction](splitArgs);
  },
  encode: (splitArgs) => {
    codecController.format[splitArgs.userCodec](true, splitArgs);
  },
  decode: (splitArgs) => {
    codecController.format[splitArgs.userCodec](false, splitArgs);
  }
};

const showError = function(input, name){
  if(input === undefined){
    console.log(chalk.red('<%s> must be provided. See \'coco help\'.'), name);

  }
  else{
    console.log(chalk.red('\'%s\' is not a recognized coco %s. See \'coco help\'.'), input, name);
  }
};

const actionMap = {
  "encode": cocoAction.codecCommon,
  "decode": cocoAction.codecCommon,
};

module.exports = cocoAction;
