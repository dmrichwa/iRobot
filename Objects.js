const Discord = require("discord.js");
const LastFmNode = require("lastfm").LastFmNode;
const loadJsonFile = require("load-json-file");
const client = new Discord.Client();
const lastfm = new LastFmNode({
	api_key: "676195f936ca2717207d1fbb1088d6e7",
	secret: "37cebc5f510030016c68d9079d932131",
	useragent: "iRobot/2.0.0"
});

module.exports = {
	client: client,
	lastfm: lastfm,
	tictactoe: [],
	Discord: Discord,
}

module.exports.getReminders = function() {
	return new Promise(function(resolve, reject) {
		loadJsonFile("./Objects/reminders.json").then(json => {
			resolve(json);
		}).catch(error => {
			resolve({});
		});
	});
}

module.exports.getWarnings = function() {
	return new Promise(function(resolve, reject) {
		loadJsonFile("./Objects/warnings.json").then(json => {
			resolve(json);
		}).catch(error => {
			resolve({});
		});
	});
}