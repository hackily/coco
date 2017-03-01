const trucolor = require('trucolor');

let palette = {
	"red" : "red",
	"green" : "green",
	"blue" : "blue",
}
let chalk = trucolor.chalkish(trucolor.simple());

const colorRGB = function(input){

}

const colorJWT = function(args, input){
	let colored = input;
	if(args.isEncode){
		let colorPayload = input.split('.');
		let header = chalk.red(colorPayload[0]) + '.';
		let body = chalk.green(colorPayload[1]) + '.';
		let sig = chalk.blue(colorPayload[2]);
		colored = header + body + sig;
	}
	else{
		colored = chalk.yellow(input);
	}
	return colored;
};

const colorBase64 = function(args, input){
	let colored = chalk.yellow(input);
	return colored;
};

const colorHex = function(args, input){
	if(args.isEncode){
		return chalk.yellow(input);
	}
	if(args.userOption === 'rgb'){
		let rgb = input.split(' ');
		rgb[0] = chalk.red(rgb[0]);
		rgb[1] = chalk.green(rgb[1]);
		rgb[2] = chalk.blue(rgb[2]);
		const pal = trucolor.palette({}, {"bg" : 'background ' + args.userInput});
		//TODO: See if this works in trucolor console
		console.log(pal.bg.in + '        ' + pal.bg.out);
		return rgb.join(' ');
	}
}

const colorUri = function(args, input){
	return input;
};

const colorAscii = function(args, input){
	return input;
}


module.exports = {
	"rgb": colorRGB,
	"jwt": colorJWT,
	"base64": colorBase64,
	"hex": colorHex,
	"ascii": colorAscii,
	"uri": colorUri

}