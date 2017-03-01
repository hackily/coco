const chai = require('chai');
const should = chai.should();
const codec = require('../controllers/codecController');
const colorMe = require('../controllers/colorController');



describe('Codecs', () => {
	let splitArgs = {};
	beforeEach((done)=>{
		splitArgs = {
      userArgs: [],
      switches: [],
      userAction: '',
      userCodec: 'jwt',
      userInput: '',
      userOption: '',
      isEncode: false,
      isHelp: false,
      toFile: false,
      saveDir: '',
      // readDir: ''
    };
		done();
	});
	describe('jwt', () => {
		it('encodes', (done) => {
			splitArgs.userInput = 'foo';
				const payload = codec.format.jwt(true, splitArgs);
				payload.should.equal("eyJhbGciOiJIUzI1NiJ9.Zm9v.e9GIpxSlE2d3PGzTnDAtSm4MsowWxdn3NR2c13K64OE");
			done();
		});
		it('colors encodes', (done) => {
			const payload = "eyJhbGciOiJIUzI1NiJ9.Zm9v.e9GIpxSlE2d3PGzTnDAtSm4MsowWxdn3NR2c13K64OE";
			splitArgs.isEncode = true;
			const colored = colorMe.jwt(splitArgs, payload);
			console.log('        ' + colored);
			colored.should.equal('\u001b[31meyJhbGciOiJIUzI1NiJ9\u001b[39m.\u001b[32mZm9v\u001b[39m.\u001b[34me9GIpxSlE2d3PGzTnDAtSm4MsowWxdn3NR2c13K64OE\u001b[39m');
			done();
		});
		it('encodes with provided secret', (done) => {
			splitArgs.userInput = 'foo';
			splitArgs.userOption = 'secret';
				const payload = codec.format.jwt(true, splitArgs);
				payload.should.equal("eyJhbGciOiJIUzI1NiJ9.Zm9v.0pehoi-RMZM1jl-4TP_C4Y6BJ-bcmsuzfDyQpkpJkh0");
			done();
		});
		it('decodes', (done) => {
			splitArgs.userInput = 'eyJhbGciOiJIUzI1NiJ9.Zm9v.0pehoi-RMZM1jl-4TP_C4Y6BJ-bcmsuzfDyQpkpJkh0';
			splitArgs.userOption = 'secret';
				const payload = codec.format.jwt(false, splitArgs);
				payload.should.equal('"foo"');
			done();
		});
	});
	describe('base64', () =>{
		let splitArgs = {};
		beforeEach((done)=>{
			splitArgs = {
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
			done();
		});
		it('encodes', (done) => {
			splitArgs.userInput = 'someinput';
			const payload = codec.format.base64(true, splitArgs);
			payload.should.equal('c29tZWlucHV0');
			done();
		});
		it('decodes', (done) => {
			splitArgs.userInput = 'c29tZWlucHV0';
			const payload = codec.format.base64(false, splitArgs);
			payload.should.equal('someinput');
			done();
		});
		it('colors encode output', (done) => {
			const payload = "input";
			splitArgs.isEncode = true;
			const colored = colorMe.base64(splitArgs, payload);
			console.log('        ' + colored);
			colored.should.equal('\u001b[33minput\u001b[39m');
			done();
		});
	});
	describe('hex', () =>{
		let splitArgs = {};
		beforeEach((done)=>{
			splitArgs = {
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
			done();
		});
		it('encodes', (done) => {
			splitArgs.userInput = '12';
			const payload = codec.format.hex(true, splitArgs);
			payload.should.equal('C');
			done();
		});
		it('decodes', (done) => {
			splitArgs.userInput = 'FF';
			const payload = codec.format.hex(false, splitArgs);
			payload.should.equal(255);
			done();
		});
		it('colors encode output', (done) => {
			const payload = "CC";
			splitArgs.isEncode = true;
			const colored = colorMe.hex(splitArgs, payload);
			console.log('        ' + colored);
			colored.should.equal('\u001b[33mCC\u001b[39m');
			done();
		});
		it('decodes to rgb with shorthex', (done) => {
			splitArgs.userInput = 'ABC';
			splitArgs.userOption = 'rgb';
			const payload = codec.format.hex(false, splitArgs);
			payload.should.equal('170 187 204');
			done();
		});
		it('decodes to rgb with normal #hex', (done) => {
			splitArgs.userInput = 'AABBCC';
			splitArgs.userOption = 'rgb';
			const payload = codec.format.hex(false, splitArgs);
			payload.should.equal('170 187 204');
			done();
		});
		it('colors resulting rgb', (done) => {
			splitArgs.userInput = "#ABC";
			splitArgs.userOption = 'rgb';
			const payload = '170 187 204';
			const colored = colorMe.hex(splitArgs, payload);
			console.log('        ' + colored);
			colored.should.equal('\u001b[31m170\u001b[39m \u001b[32m187\u001b[39m \u001b[34m204\u001b[39m');
			done();
		});
	});
	describe('uri', () =>{
		let splitArgs = {};
		beforeEach((done)=>{
			splitArgs = {
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
			done();
		});
		it('encodes', (done) => {
			splitArgs.userInput = 'https://mywebsite.com/input?p=1&q="latitude!?"';
			const payload = codec.format.uri(true, splitArgs);
			payload.should.equal('https://mywebsite.com/input?p=1&q=%22latitude!?%22');
			done();
		});
		it('decodes', (done) => {
			splitArgs.userInput = 'https://mywebsite.com/input?p=1&q=%22latitude!?%22';
			const payload = codec.format.uri(false, splitArgs);
			payload.should.equal('https://mywebsite.com/input?p=1&q="latitude!?"');
			done();
		});
		it('colors encode output', (done) => {
			const payload = 'https://mywebsite.com/input?p=1&q=%22latitude!?%22';
			splitArgs.isEncode = true;
			const colored = colorMe.uri(splitArgs, payload);
			console.log('        ' + colored);
			colored.should.equal('\u001b[33mhttps://mywebsite.com/input?p=1&q=%22latitude!?%22\u001b[39m');
			done();
		});
	});
	describe('binary', () =>{
		let splitArgs = {};
		beforeEach((done)=>{
			splitArgs = {
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
			done();
		});
		it('encodes', (done) => {
			splitArgs.userInput = '12345';
			const payload = codec.format.binary(true, splitArgs);
			payload.should.equal('11000000111001');
			done();
		});
		it('decodes', (done) => {
			splitArgs.userInput = '101010111101';
			const payload = codec.format.binary(false, splitArgs);
			payload.should.equal(2749);
			done();
		});
		it('colors encode output', (done) => {
			const payload = '1110010101010';
			splitArgs.isEncode = true;
			const colored = colorMe.binary(splitArgs, payload);
			console.log('        ' + colored);
			colored.should.equal('\u001b[33m1110010101010\u001b[39m');
			done();
		});
	});
/*
		"binary": translateBinary,
		"ascii": translateAscii,
*/
});