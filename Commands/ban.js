const { user_form, get_member } = require("../Utils/");

exports.run = async (client, msg, args) => {
	if (!msg.member.hasPermission("BAN_MEMBERS")) {
		return msg.channel.send("You must have Ban Members permission to ban.");
	}
	get_member(args.splice(1).join(" "), msg.guild, null).then(member => {
		if (member.hasPermission("KICK_MEMBERS")) {
			return msg.channel.send("You cannot kick somebody with the Kick Members permission.");
		}
		let reason = args.join(" ");
		member.send(`**You have been banned from ${msg.guild.name}. Reason: ${reason}**`);
		member.ban({ days: 0, reason: user_form(msg.member) + ": " + reason});
		msg.channel.send("<@" + member.id + "> has been banned.");
	}).catch(error => {
		msg.channel.send("Error: " + error.message);
	});
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "ban",
	aliases: [],
	category: "Staff",
	description: "Bans a user",
	usage: "ban @Tree#1019"
};