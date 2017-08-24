'use strict'

const PushOver = require('./pushover');
const tcpp = require('tcp-ping');
const async = require('async');
const config = require('../config');
var redis = null;

function Checker () {
	// body...
	try {
		if (config.REDIS_URL != '') {
			redis = require("redis").createClient(config.REDIS_URL);
		}
	} catch(e) {
		console.error('Could not create the redis client', e);
	}
}

const STATUS = {
	NONE: null
	, STOPPED: 0
	, STARTED: 1
};

const ELECTRIC_STATUS = {
	NONE: null,
	POWER_OFF: 0,
	POWER_ON: 1
};

Checker.prototype._timer = null;
Checker.prototype._status = STATUS.NONE;
Checker.prototype._lastElectricStatus = ELECTRIC_STATUS.NONE;
Checker.prototype._pushOver = null;
Checker.prototype._checkPeriod = config.CHECK_PERIOD;

Checker.prototype.check = function() {

	console.log('checking');

	async.series([

		function(callback) {
			if (redis == null || this._lastElectricStatus != null) {
				return callback(null);
			}

			redis.get('_lastElectricStatus', function(err, reply) {
				
				if (err) {
					console.error('Could not get _lastElectricStatus from redis', err); 
				} else {
					this._lastElectricStatus = parseInt(reply, 10);
				}

				callback(null);

			}.bind(this));

		}.bind(this),

		function(callback) {

			tcpp.probe(config.HOME_HOST, 80, function(err, isAlive){
        
		        console.log('pinging to', config.HOME_HOST);
		        console.log('ping result is', isAlive, err);
		        console.log('last result is', this._lastElectricStatus);

		        let electricStatus = !err && isAlive ? ELECTRIC_STATUS.POWER_ON : ELECTRIC_STATUS.POWER_OFF;
		        if (this._lastElectricStatus == ELECTRIC_STATUS.NONE || this._lastElectricStatus != electricStatus) {

		        	if (!this._pushOver) {
		        		this._pushOver = new PushOver();
		        	}

		        	console.log('sending push notification');

		        	this._pushOver.push(electricStatus == ELECTRIC_STATUS.POWER_OFF ? 'Elektrikler Gitti' : 'Elektrikler Geldi'
		        		, electricStatus == ELECTRIC_STATUS.POWER_OFF ? 'Evdeki internete erişim sağlanamıyor' : 'Internet Var'
		        		, function(err) {
		        			if (err) {
		        				console.error(err);
		        			}
		        		});

		        	this._lastElectricStatus = electricStatus;

		        	if (redis) {
		        		redis.set('_lastElectricStatus', electricStatus);
		        	}

		        }

		        callback(null);

		    }.bind(this), {
		    	 timeout: 10
		    });

		}.bind(this)

	], function(err) {
		console.log('finished async.series');
		if (!redis) {
			this._timer = setTimeout(this.check.bind(this), this._checkPeriod);
		} else {
			process.exit();
		}
	}.bind(this));
};

Checker.prototype.start = function() {
	console.log('starting status is', this._status);
	if (this._status == STATUS.NONE || this._status == STATUS.STOPPED) {
		if (!redis) {
			this._timer = setTimeout(this.check.bind(this), this._checkPeriod);
		}
		this._status = STATUS.STARTED;
		this.check();
	}

};

Checker.prototype.stop = function() {
	
	if (this._status == STATUS.STARTED) {
		if (this._timer) {
			clearTimeout(this._timer);
			this._timer = null;
		}
		this._status = STATUS.STOPPED;
	}

};

Checker.prototype.status = function() {
	return this._status;
};

module.exports = Checker;