const { dateFormat, embedify, rainbow, get_channel, pluralize } = require("../Utils/");
const { CREATOR_ID, CHANS_ANNOUNCE } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	if (CREATOR_ID.indexOf(msg.author.id) <= -1) {
		return msg.channel.send("Must be bot creator to use this command.");
	}
	(async () => {
		for (var channel of CHANS_ANNOUNCE) {
			await new Promise(next => {
				const guild = client.guilds.get(channel[1]);
				get_channel(channel[0], guild).then(channel => {
					console.log("Sending announcement in " + guild + " to " + channel.name);
					var embed = embedify("Bot Announcement", rainbow(25, Math.random() * 25),
					[
					], "", args.slice(1).join(" "), "🕒 " + dateFormat(msg.createdAt, "MEDTIMEDATE"), "", "", "", "");
					channel.send({ embed: embed });
					next();
				}).catch(error => {
					msg.channel.send("Error: " + error.message);
					next();
				});
			});
		}
	})();
	msg.channel.send("Announcements sent to " + CHANS_ANNOUNCE.length + " " + pluralize("server", "servers", CHANS_ANNOUNCE.length));
};

exports.config = {
	delete: true,
	hidden: false,
};

exports.help = {
	name: "botannounce",
	aliases: [],
	category: "Miscellaneous",
	description: "Sends a global announcement",
	usage: "botannounce (message)"
};