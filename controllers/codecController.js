const jwt = require('jsonwebtoken');
const trucolor = require('trucolor');
const chalk = require('chalk');

var base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=0;var c1=0;var c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);var c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}


let AsciiToBin={toAscii:function(a){return a.replace(/\s*[01]{8}\s*/g,function(a){return String.fromCharCode(parseInt(a,2))})},toBinary:function(a,b){return a.replace(/[\s\S]/g,function(a){a=AsciiToBin.zeroPad(a.charCodeAt().toString(2));return!1==b?a:a+" "})},zeroPad:function(a){return"00000000".slice(String(a).length)+a}};

const hexToRGB = function(hex){
	hex = hex.replace('#', '');
	const hexify = trucolor.chalkish(trucolor.palette({}, {
		color: 'background ' + hex
	}))
	let red = parseInt(hex.substring(0, 2*hex.length/3), 16).toString();
	let green = parseInt(hex.substring(hex.length/3, 2*hex.length/3), 16).toString();
	let blue = parseInt(hex.substring(2*hex.length/3, hex.length), 16).toString();

	console.log(hexify.color('    '));
	return chalk.red(red) + ' ' + chalk.green(green) + ' ' + chalk.blue(blue);
	//TODO: See if this outputs color correctly in a 24-bit console
}

const showError = function(input, name){
  if(input === undefined){
    console.log(chalk.red('<%s> must be provided. See \'coco help\'.'), name);

  }
  else{
    console.log(chalk.red('\'%s\' is not recognized. Please provide a valid <%s>. See \'coco help\'.'), input, name);
  }
};

const translateJwt = function(isEncode, splitArgs){
	let secret = 'shh';
	if(splitArgs.userOption){
		secret = splitArgs.userOption;
	}
	else if(isEncode){
		console.log(chalk.yellow('No secret provided. Be aware that the generated jwt will not work\n'));
	}
	let payload = isEncode ? jwt.sign(splitArgs.userInput, secret) : JSON.stringify(jwt.decode(splitArgs.userInput), null, 2);
	if(payload === null) payload = "Invalid JWT";

	//colorize
	payload = {"payload": payload, "color": ''};
	if(isEncode){
		let colorPayload = payload.split('.');
		payload.color = chalk.red(colorPayload[0]) + '.' + chalk.magenta(colorPayload[1]) + '.' + chalk.blue(colorPayload[2]);
	}
	return payload;

}
const translateBase64 = function(isEncode, splitArgs){
	const payload = isEncode ? base64.encode(splitArgs.userInput) : base64.decode(splitArgs.userInput);
	payload = {"payload" : payload}
	return payload;
}
const translateHex = function(isEncode, splitArgs){
	let payload = '';
	const fn = {
		"rgb": hexToRGB
	}
	if(!fn[splitArgs.userOption]){
		let input = splitArgs.userInput.replace('#', '');
		console.log("Hexadecimal to decimal");
		payload = isEncode ? parseInt(input).toString(16).toUpperCase() : parseInt(input, 16);
	}
	else{
		payload = fn[splitArgs.userOption](splitArgs.userInput);
	}
	if(payload === "NAN"){
		return showError(splitArgs.userInput, '<input>')
	}
	payload = {"payload" : payload}
	return payload;
}
const translateUri = function(isEncode, splitArgs){
	const payload = isEncode ? encodeURIComponent(splitArgs.userInput) : decodeURIComponent(splitArgs.userInput);
	payload = {"payload" : payload}

	return payload;
}
const translateBinary = function(isEncode, splitArgs){
	if(isEncode && !/^\d+$/.test(splitArgs.userInput) || (!isEncode && /[^0-1]/g.test(decode.value))){
		console.log('Invalid splitArgs.userInput');
		return;
	}
	const payload = isEncode ? (parseInt(splitArgs.userInput) >>> 0).toString(2) : parseInt(splitArgs.userInput, 2);
	payload = {"payload" : payload}
	return payload;
}

const translateAscii = function(isEncode, splitArgs){
	//const payload = isEncode ? AsciiToBin.toBinary(splitArgs.userInput) : AsciiToBin.toAscii(splitArgs.userInput);
	//string to ascii
	let payload = '';
	if(isEncode){
		for(let n = 0; n < splitArgs.userInput.length; n++){
			payload += splitArgs.userInput.charCodeAt(n) + ' ';
		}
	}
	else{
		splitArgs.userInput.split(' ').forEach(x=> payload += String.fromCharCode(x));
	}

	payload = {"payload" : payload}
	return payload;
}



exports.format = {
		"jwt": translateJwt,
		"base64": translateBase64,
		"hex": translateHex,
		"uri": translateUri,	
		"binary": translateBinary,
		"ascii": translateAscii,
};

