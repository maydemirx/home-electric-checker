'use strict'

const push = require('pushover-notifications');
const async = require('async');
const config = require('../config');

function PushOver() {};

PushOver.prototype.push = function(message, title, callback) {
	
	let	sound = config.DEFAULT_SOUND;
	let devices = config.DEVICES.split(',');
	let priority = 1;

	let p = new push( {
		user: config.PUSHOVER_USER,
		token: config.PUSHOVER_TOKEN
	});

	console.log('sending push notification devices are', devices);

	async.each(devices, function(device, callback) {

		console.log('sending push notification to device', device);

		let msg = {
		  message: message,
		  title: title,
		  devices: device,
		  sound: sound, 
		  priority: priority
		};
		p.send( msg, callback );
		
	}, callback);

};

module.exports = PushOver;