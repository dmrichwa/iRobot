const { dateFormat, user_form, embedify, get_member } = require("../Utils/");
const { CATEGORIES } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	const doFull = args[1] && args[1].toLowerCase() === "full";
	var input;
	if (doFull) {
		input = args.splice(2).join(" ");
	}
	else {
		input = args.splice(1).join(" ");
	}
	get_member(input, msg.guild, msg.member).then(member => {
		var status = "";
		switch (member.presence.status) {
			case "online":
				status = "Online";
				break;
			case "offline":
				status = "Offline";
				break;
			case "idle":
				status = "Idle";
				break;
			case "dnd":
				status = "DND";
				break;
			default:
				status = "Unknown";
				console.log("Unknown status!");
				break;
		}
		var str = "🆔 **ID**: " + member.id + "\n"
		if (member.nickname) {
			str += "📛 **Nickname**: " + member.nickname + "\n"
		}
		str += "🌈 **Color**: " + (member.colorRole ? member.displayHexColor : "None") + "\n"
		str += "🌐 **Discord Join Date**: " + dateFormat(member.user.createdAt, "MEDTIMEDATE") + "\n"
		str += "📆 **Server Join Date**: " + dateFormat(member.joinedAt, "MEDTIMEDATE") + "\n"
		if (doFull) {
			str += "🛡 **Roles (" + (member.roles.size - 1) + ")**: " + member.roles.array().filter(r => r !== msg.guild.defaultRole).sort((a, b) => { return b.position - a.position }).join(", ") + "\n"
		}
		else {
			str += "🛡 **Roles**: " + (member.roles.size - 1) + "\n"
		}
		var embed = embedify("[" + status + "] " + user_form(member) + (member.user.bot ? " 🤖" : ""), (member.colorRole ? member.displayHexColor : CATEGORIES.INFO.color),
		[
		], "", str, "", "", member.user.displayAvatarURL, "", "");
		msg.channel.send({ embed: embed});
	}).catch(error => {
		msg.channel.send("Error: " + error.message);
	});
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "userinfo",
	aliases: ["uinfo"],
	category: "Info",
	description: "Gives information about a certain user",
	usage: "uinfo (full) (user name or ID)"
};