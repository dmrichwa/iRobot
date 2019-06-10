const { embedify, invalid_usage, has_permission, get_member, get_channel } = require("../Utils/");
const { CATEGORIES } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	if (!has_permission(["KICK_MEMBERS"], msg.member)) {
		return msg.channel.send("Must have kick members permission to use chanban");
	}
	if (args.length < 3) {
		return msg.channel.send({ embed: invalid_usage(this) });
	}
	
	get_channel(args[1], msg.guild).then(channel => {
		get_member(args.splice(2).join(" "), msg.guild).then(member => {
			if (has_permission(["KICK_MEMBERS"], member)) {
				return msg.channel.send("Cannot chanban someone with the kick members permission");
			}
			channel.overwritePermissions(member, { SEND_MESSAGES: false, VIEW_CHANNEL: false, ADD_REACTIONS: false }, msg.content).then(() => {
				var embed = embedify("", CATEGORIES.STAFF.color,
				[
				], "", member.toString() + " banned from " + channel.toString(), "", "", "", "", "");
				msg.channel.send({ embed: embed });
			});
		}).catch(error => {
			msg.channel.send("Error: " + error.message);
		});
	}).catch(error => {
		msg.channel.send("Error: " + error.message);
	});
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "chanban",
	aliases: ["channelban"],
	category: "Staff",
	description: "Bans a user from a channel",
	usage: "chanban (#channel) (@user)"
};