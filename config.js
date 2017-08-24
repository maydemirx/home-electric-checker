module.exports = {

	// ============= REQUIRED PARAMETERS ======================================================================

	/*
	* PUSHOVER_USER: <String> The push over user key for the push notification api authentication
	*/
	PUSHOVER_USER: process.env.PUSHOVER_USER || 'none',

	/*
	* PUSHOVER_TOKEN: <String> The push over token key for the push notification api authentication
	*/
	PUSHOVER_TOKEN: process.env.PUSHOVER_TOKEN || 'none',

	/*
	* HOME_HOST: the checker sends the ping to this ip or hostname to check internet connectivity
	* 	it can be an ip address or dns name
	*/

	HOME_HOST: process.env.HOME_HOST || '',



	// ============= OPTIONAL PARAMETERS ======================================================================

	/*
	* DEVICES: <Comma Delimited String> the string list of the devices that the push notification will be send
	* if you want to send messages to multiple devices you must separate them by comma like that: device 1,device 2
	*/
	DEVICES: process.env.DEVICES || '',

	/*
	* DEFAULT_SOUND: <String> The sound playing on the device when the message arrived from push notification api
	* 	it can be choosing fallowing list
			* key	- description
			* pushover - Pushover (default)    
			* bike - Bike    
			* bugle - Bugle    
			* cashregister - Cash Register    
			* classical - Classical    
			* cosmic - Cosmic    
			* falling - Falling    
			* gamelan - Gamelan    
			* incoming - Incoming    
			* intermission - Intermission    
			* magic - Magic    
			* mechanical - Mechanical    
			* pianobar - Piano Bar    
			* siren - Siren    
			* spacealarm - Space Alarm    
			* tugboat - Tug Boat    
			* alien - Alien Alarm (long)    
			* climb - Climb (long)    
			* persistent - Persistent (long)    
			* echo - Pushover Echo (long)    
			* updown - Up Down (long)    
			* none - None (silent)
	*/

	DEFAULT_SOUND: process.env.DEFAULT_SOUND || 'pushover',

	/*
	* CHECK_PERIOD: <Number> the checker check each this period in miliseconds
	*/

	CHECK_PERIOD: process.env.CHECK_PERIOD || 1 * 60 * 1000 // each 1 min

	/*
	* REDIS_URL: <String> the redis url that variables will be saved on
	* 	If you describe the redis host then the app saves own internal variables
	*	on redis.
	*/
	REDIS_URL: process.env.REDIS_URL || ''

};