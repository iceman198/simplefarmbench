var fs = require('fs');

var logLevel;
var logFile;
var fileSizeLimit = 2; // in megabytes

function Logger(logfile, loglevel) {
	logLevel = loglevel;
	logFile = logfile;
}

function writeToLogFile(text) {
	var fs = require('fs');
	if (!fs.existsSync(logFile)) { // create the file if it doesn't exist
		fs.writeFile(logFile, new Date() + ' - File created\n', function(err) {
			if(err) {
				return console.log(err);
			}
		});
	} else {
		fs.appendFile(logFile, text + '\n', function(err) {
			if(err) {
				return console.log('ERROR: ' + err);
			}
		}); 
		
		// get the file size
		try {
			var stats = fs.statSync(logFile);
			var fileSizeInBytes = stats["size"];
			var fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
			if (fileSizeInMegabytes > fileSizeLimit) {
				var newFileName = logFile + '.' + Date.now();
				fs.rename(logFile, newFileName, function(err) {
					if (err) {
						return console.log(err);
					} else {
						fs.writeFile(logFile, new Date() + ' - File created\n', function(err) {
							if(err) {
								return console.log(err);
							}
							//console.log("The file was saved!");
						}); 
							}
				});
			}
		} catch (ex) {
			console.log('ERROR CHECKING LOGFILESIZE: ' + ex);
		}
	}
}

Logger.prototype.log = (level, desc, text) => {
	var levelNum = 0;
	var logLevelNum = 0;
	
	if (level == 'all') {
		levelNum = 0;
	} else if (level == 'debug') {
		levelNum = 1;
	} else if (level == 'info') {
		levelNum = 2;
	} else if (level == 'error') {
		levelNum = 3;
	} else if (level == 'off') {
		levelNum = 4;
	}
	
	if (logLevel == 'all') {
		logLevelNum = 0;
	} else if (logLevel == 'debug') {
		logLevelNum = 1;
	} else if (logLevel == 'info') {
		logLevelNum = 2;
	} else if (logLevel == 'error') {
		logLevelNum = 3;
	} else if (logLevel == 'off') {
		logLevelNum = 4;
	} else {
		logLevelNum = 0;
	}
	
	//console.log('logLevelNum: ' + logLevelNum + ' // levelNum passed: ' + levelNum);
	
	var stringFile = '"' + new Date() + '","' + level + '","' + desc + '","' + text + '"';
	var stringConsole = new Date() + ' || ' + level + ' || ' + desc + ' || ' + text;
	if (logLevelNum <= levelNum) {
		console.log(stringConsole);
		writeToLogFile(stringFile);
	} else {
		console.log('NOT IN LOG ** ' + stringConsole);
	}
}

function use(logfile, loglevel) {
	return new Logger(logfile, loglevel);
}

exports.Logger = Logger;
exports.use = use;