const chalk = require('chalk');
const cocoLib = require('../lib/lib');
const codecController = require('./codecController');
const colorMe = require('./colorController');
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
      isEncode: false,
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
        //TODO: Check if we are overwriting a file, and if dir exists.
        //Several states.
        //Directory exists, file does not.
        //Directory and file exists
        //Directory does not exist
        n++;
        splitArgs.saveDir = userArgs[n];

        if(cocoLib.isDir(splitArgs.saveDir)){
          //will overrite
          console.log("Will overwrite " + splitArgs.saveDir);
        }
        else{
          //Make new file?
          console.log("need to create new file");
          //return showError(dir, "path");
        }
        // if(!cocoLib.isDir(splitArgs.saveDir)){

        // } 
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
        splitArgs.switches.push(item);
        continue;
      }
      //If it's not a switch, it's a normal argument
      splitArgs.userArgs.push(item);
    }
    
    //Store the user specified action. We only care about lowercasing things that aren't input.
    splitArgs.userAction = splitArgs.userArgs[0] ? splitArgs.userArgs[0].toLowerCase() : '';
    splitArgs.userCodec = splitArgs.userArgs[1] ? splitArgs.userArgs[1].toLowerCase() : '';
    splitArgs.isEncode = splitArgs.userAction === 'encode' ? true : false;
    splitArgs.userInput = splitArgs.userArgs[2];
    splitArgs.userOption = splitArgs.userArgs[3] ? splitArgs.userArgs[3].toLowerCase() : '';

    if(!splitArgs.userAction || splitArgs.userAction === 'help'){
      return help.help();
    }
    //If action isn't mapped to a supported value, show error.
    if(!actionMap[splitArgs.userAction]){
      return showError(splitArgs.userAction, "<action>");
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
      return showError(splitArgs.userCodec, '<codec>');
    }
    //If there is no input...
    if(splitArgs.userInput === undefined){
      if(splitArgs.isHelp){
        return help.codecHelp[splitArgs.userCodec]();
      }
      else{
        return showError(splitArgs.userInput, '<input>');
      }
    }
    //Check to see if input argument is a file
    if(cocoLib.fileExists(splitArgs.userInput)){
      userInputIsFile = true;
      splitArgs.userInput = cocoLib.readFile(splitArgs.userInput);
    }

    //Run handler for actual action.
    let payload = cocoAction[splitArgs.userAction](splitArgs);


    //If we needed to save, now's the time to do it.
    if(splitArgs.saveDir){
      cocoLib.createFile(splitArgs.saveDir, payload.payload);
    }
    //We can return console output there
    //By default, we color the input.
    const colored = colorMe[splitArgs.userCodec](splitArgs, payload);
    if(colored){
      console.log(colored);
    }
    else{
      console.log(payload);
    }
  },
  encode: (splitArgs) => {
    return codecController.format[splitArgs.userCodec](splitArgs.isEncode, splitArgs);
  },
  decode: (splitArgs) => {
    return codecController.format[splitArgs.userCodec](splitArgs.isEncode, splitArgs);
  }
};

const showError = function(input, name){
  if(input === undefined){
    throw "new error";
    console.log(chalk.red('%s must be provided. See \'coco help\'.'), name);

  }
  else{
    console.log(chalk.red('\'%s\' is not recognized. Please provide a valid %s. See \'coco help\'.'), input, name);
  }
};

// const debug = function(){
//   const trucolor = require('trucolor');
//   const chalkishPalette = trucolor.chalkish(trucolor.palette({}, {
//     red: "red"
//   }));
//   console.log(chalkishPalette.red('txt'));
//   console.log('h');
// };

const actionMap = {
  "encode": cocoAction.codecCommon,
  "decode": cocoAction.codecCommon,
  // "debug": debug
};



module.exports = cocoAction;
