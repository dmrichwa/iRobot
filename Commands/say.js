const { get_channel } = require("../Utils/");
const { CREATOR_ID } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	if (CREATOR_ID.indexOf(msg.author.id) <= -1) {
		return msg.channel.send("Must be bot creator to use this command.");
	}
	get_channel(args[1], msg.guild).then(channel => {
		channel.send(args.splice(2).join(" "));
	}).catch(error => {
		msg.channel.send("Error: " + error.message);
	});
};

exports.config = {
	delete: true,
	hidden: false,
};

exports.help = {
	name: "say",
	aliases: [],
	category: "Miscellaneous",
	description: "Makes the bot send a message",
	usage: "say (channel Id) (message)"
};