const jwt = require('jsonwebtoken');
const trucolor = require('trucolor');
const chalk = require('chalk');

var base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=0;var c1=0;var c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);var c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}


let AsciiToBin={toAscii:function(a){return a.replace(/\s*[01]{8}\s*/g,function(a){return String.fromCharCode(parseInt(a,2))})},toBinary:function(a,b){return a.replace(/[\s\S]/g,function(a){a=AsciiToBin.zeroPad(a.charCodeAt().toString(2));return!1==b?a:a+" "})},zeroPad:function(a){return"00000000".slice(String(a).length)+a}};

const hexRGBCodec = function(isEncode, input){
	let hex = input.replace('#', '');
	let payload = '';
	if(!isEncode){
		if(!(hex.length === 3 || hex.length === 6)){
			return showError("hex input", "input");
		}
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		const rgb = result.slice(1).map((item) => {
			return parseInt(item, 16);
		})

		payload = rgb.join(' ');
	}
	else{
		const rgb = input.split(' ');
		const hex = "#" + rgb.map((item) => {return parseInt(item).toString(16).toUpperCase()}).join('');
		payload = hex;
	}
	return payload;
}
const hexDecCodec = function(isEncode, hex){
	hex = hex.replace('#', '');
	const payload = isEncode ? parseInt(hex).toString(16).toUpperCase() : parseInt(hex, 16);
	return payload;
}

const translateJwt = function(isEncode, splitArgs){
	//Use this secret if none is provided
	let secret = 'shh';
	if(splitArgs.userOption){
		secret = splitArgs.userOption;
	}
	else if(!process.env.NODE_ENV && isEncode){
		console.log(chalk.yellow('No secret provided. Be aware that the generated jwt will not work'));
	}
	let payload = isEncode ? jwt.sign(splitArgs.userInput, secret) : JSON.stringify(jwt.decode(splitArgs.userInput), null, 2);
	if(payload === null) payload = "Invalid JWT";
	return payload;
}
const translateBase64 = function(isEncode, splitArgs){
	let payload = isEncode ? base64.encode(splitArgs.userInput) : base64.decode(splitArgs.userInput);
	return payload;
}
const translateHex = function(isEncode, splitArgs){
	let payload = '';
	const fn = {
		"rgb": hexRGBCodec,
		"hex": hexDecCodec,
		"dec": hexDecCodec,
		"decimal": hexDecCodec,
		"hexadecimal": hexDecCodec
	}
	//Default case, 
	if(!fn[splitArgs.userOption]){
		payload = hexDecCodec(isEncode, splitArgs.userInput);
	}
	else{
		//Do different action depending on option, mapped above.
		payload = fn[splitArgs.userOption](isEncode, splitArgs.userInput);
	}

	if(payload === "NAN"){
		throw new Error("Dec to Hex input was NaN");
	}
	return payload;
}
const translateUri = function(isEncode, splitArgs){
	const payload = isEncode ? encodeURI(splitArgs.userInput) : decodeURI(splitArgs.userInput);
	return payload;
}
const translateBinary = function(isEncode, splitArgs){
	if(isEncode && !/^\d+$/.test(splitArgs.userInput) || (!isEncode && /[^0-1]/g.test(splitArgs.userInput))){
		throw new 'Invalid Input';
	}
	const payload = isEncode ? (parseInt(splitArgs.userInput) >>> 0).toString(2) : parseInt(splitArgs.userInput, 2);
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

