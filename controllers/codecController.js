const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const prettyjson = require('prettyjson');


let encodedInput, decodedInput;
var base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=0;var c1=0;var c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);var c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}


let AsciiToBin={toAscii:function(a){return a.replace(/\s*[01]{8}\s*/g,function(a){return String.fromCharCode(parseInt(a,2))})},toBinary:function(a,b){return a.replace(/[\s\S]/g,function(a){a=AsciiToBin.zeroPad(a.charCodeAt().toString(2));return!1==b?a:a+" "})},zeroPad:function(a){return"00000000".slice(String(a).length)+a}};



let input = null;
let output = null;
let isEncode = null;
let encode = null;
let decode = null;


const translateJwt = function(isEncode, input){
	let payload = isEncode ? jwt.sign(input, "shh") : jwt.decode(input);
	if(payload === null) payload = "Invalid JWT";
	isEncode ? console.log(payload) : console.log(JSON.stringify(payload, null, 2))
	//output.value = typeof payload === "object" ? JSON.stringify(payload, null, 2) : payload;
	

}
const translateBase64 = function(isEncode, input){
	const payload = isEncode ? base64.encode(input) : base64.decode(input);
	console.log(payload);
}
const translateHex = function(isEncode, input){
	let payload = isEncode ? parseInt(input).toString(16).toUpperCase() : parseInt(input, 16);
	console.log(payload);
}
const translateUri = function(isEncode, input){
	const payload = isEncode ? encodeURIComponent(input) : decodeURIComponent(input);
	console.log(payload);
}
const translateBinary = function(isEncode, input){
	if(isEncode && !/^\d+$/.test(input) || (!isEncode && /[^0-1]/g.test(decode.value))){
		console.log('Invalid Input');
		return;
	}

	const payload = isEncode ? (parseInt(input) >>> 0).toString(2) : parseInt(input, 2);
	console.log(payload);
}

const translateAscii = function(isEncode, input){
	const payload = isEncode ? AsciiToBin.toBinary(input) : AsciiToBin.toAscii(input);
	console.log(payload);
}

exports.format = {
		"jwt": translateJwt,
		"base64": translateBase64,
		"hex": translateHex,
		"uri": translateUri,	
		"binary": translateBinary,
		"ascii": translateAscii,
};

