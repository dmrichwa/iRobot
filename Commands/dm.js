const { get_user } = require("../Utils/");
const { CREATOR_ID } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	if (CREATOR_ID.indexOf(msg.author.id) <= -1) {
		return msg.channel.send("Must be bot creator to use this command.");
	}
	get_user(args[1], msg.guild).then(user => {
		user.send(args.slice(2).join(" "));
	}).catch(error => {
		msg.channel.send("Error: " + error.message);
	});
};

exports.config = {
	delete: true,
	hidden: false,
};

exports.help = {
	name: "dm",
	aliases: [],
	category: "Miscellaneous",
	description: "Makes the bot DM a message to a user",
	usage: "dm (@user) (message)"
};