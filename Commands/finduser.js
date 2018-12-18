const { embedify } = require("../Utils/");
const { CATEGORIES } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
		var guild = args[2] ? client.guilds.get(args[2]) : msg.guild;
		var user = guild.members.get(args[1]);
		if (!user)
			user = "Not found";
		var embed = embedify("", CATEGORIES.TEST.color, [
			["User ID #" + args[1], user]
		]);
		msg.channel.send({ embed: embed});
};

exports.config = {
	delete: false,
	hidden: true,
};

exports.help = {
	name: "finduser",
	aliases: [],
	category: "Test",
	description: "Finds a user by their user ID",
	usage: "finduser (userId) [guildId]"
};