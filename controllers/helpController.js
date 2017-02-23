const chalk = require('chalk');

const help = () => {
    console.log('');
    console.log(chalk.yellow('Usage: coco <action> <codec> <input> <option>'));
    console.log(chalk.yellow('    <action> is one of:'));
    console.log(chalk.yellow('        encode, decode'));
    console.log(chalk.yellow('    <codec> is one of:'));
    console.log(chalk.yellow('        jwt, base64, hex, uri, binary, ascii'));
    console.log(chalk.yellow('    <input> can either be a directory, or a string'));
    console.log(chalk.yellow('    <option> see codec help for options'));

    console.log();
    console.log(chalk.yellow('coco <action> -h    display help on <action>'));
  }

const actionEncode = () => {
  console.log(chalk.yellow('Display encode help'));
};

const actionDecode = () => {
  console.log(chalk.yellow('Display decode help'));
};

const codecJwt = () => {
  console.log(chalk.yellow('Display jwt help'));
};
const codecBase64 = () => {
  console.log(chalk.yellow('Display codecBase64 help'));
};
const codecHex = () => {
  console.log(chalk.yellow('Display codecHex help'));
};
const codecUri = () => {
  console.log(chalk.yellow('Display codecUri help'));
};
const codecBinary = () => {
  console.log(chalk.yellow('Display codecBinary help'));
};
const codecAscii = () => {
  console.log(chalk.yellow('Display codecAscii help'));
};

module.exports = {
  help: help,
  actionHelp: {
    "encode": actionEncode,
    "decode": actionDecode

  },
  codecHelp: {
    "jwt": codecJwt,
    "base64": codecBase64,
		"hex": codecHex,
		"uri": codecUri,	
		"binary": codecBinary,
		"ascii": codecAscii
  }
};