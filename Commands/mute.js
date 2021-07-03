const { user_form, embedify, has_permission, get_member } = require("../Utils/");
const { SERV_UB, ROLE_UB_MUTE, CATEGORIES } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	if (msg.guild.id !== SERV_UB) {
		return msg.channel.send("Command not enabled for this server");
	}
	if (!has_permission(["KICK_MEMBERS"], msg.member)) {
		return msg.channel.send("You must have the Kick Members permission to use this command");
	}
	get_member(args.splice(1).join(" "), msg.guild).then(member => {
		if (member.hasPermission("KICK_MEMBERS")) {
			return msg.channel.send("You cannot mute someone with the Kick Members permission");
		}
		var embed;
		if (member.roles.has(ROLE_UB_MUTE)) {
			member.roles.remove(ROLE_UB_MUTE, "Mute removed by " + user_form(msg.author));
			embed = embedify("", CATEGORIES.STAFF.color, [ ], "", member.toString() + " unmuted", "", "", "", "", "");
		}
		else {
			member.roles.add(ROLE_UB_MUTE, "Mute added by " + user_form(msg.author));
			embed = embedify("", CATEGORIES.STAFF.color, [ ], "", member.toString() + " muted", "", "", "", "", "");
		}
		msg.channel.send({ embed: embed });
	}).catch(error => {
		msg.channel.send("Error: " + error.message);
	});
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "mute",
	aliases: ["timeout"],
	category: "Staff",
	description: "Mutes a user",
	usage: "mute (user)"
};