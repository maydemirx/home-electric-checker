'use strict'

const PushOver = require('./pushover');
const ping = require('ping');
const config = require('../config');

function Checker () {
	// body...
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
	
	ping.sys.probe(config.HOME_HOST, function(isAlive){
        
        let electricStatus = isAlive ? ELECTRIC_STATUS.POWER_ON : ELECTRIC_STATUS.POWER_OFF;
        if (this._lastElectricStatus == ELECTRIC_STATUS.NONE || this._lastElectricStatus != electricStatus) {

        	if (!this._pushOver) {
        		this._pushOver = new PushOver();
        	}

        	this._pushOver.push('Elektrikler Gitti'
        		, 'Evdeki internete erişim sağlanamıyor'
        		, function(err) {
        			if (err) {
        				console.err(err);
        			}

        			this._timer = setTimeout(this.check.bind(this), this._checkPeriod);
        		}.bind(this));

        }

    }.bind(this));


};

Checker.prototype.start = function() {
	
	if (this._status == STATUS.NONE || this._status == STATUS.STOPPED) {
		this._timer = setTimeout(this.check.bind(this), this._checkPeriod);
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