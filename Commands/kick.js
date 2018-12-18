const { user_form, get_member } = require("../Utils/");

exports.run = async (client, msg, args) => {
	if (!msg.member.hasPermission("KICK_MEMBERS")) {
		return msg.channel.send("You must have Kick Members permission to kick.");
	}
	get_member(args.splice(1).join(" "), msg.guild, null).then(member => {
		if (member.hasPermission("KICK_MEMBERS")) {
			return msg.channel.send("You cannot kick somebody with the Kick Members permission.");
		}
		member.kick(user_form(msg.member) + ": " + args.join(" "));
		msg.channel.send("<@" + member.id + "> kicked.");
	}).catch(error => {
		msg.channel.send("Error: " + error.message);
	});
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "kick",
	aliases: [],
	category: "Staff",
	description: "Kicks a user",
	usage: "kick @Tree#1019"
};