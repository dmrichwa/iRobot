const { dateFormat, embedify, get_role_array, boolean_to_yesno } = require("../Utils/");

exports.run = async (client, msg, args) => {
	const doFull = args[1] && args[1].toLowerCase() === "full";
	const channels = msg.guild.channels.cache.array();
	const emojis = msg.guild.emojis.array();
	const members = msg.guild.members.cache.array();
	const roles = get_role_array(msg.guild);

	var textChannels = [], voiceChannels = [], categories = [];
	for (var channel of channels) {
		if (channel.type === "text") {
			textChannels.push(channel);
		}
		else if (channel.type === "voice") {
			voiceChannels.push(channel);
		}
		else if (channel.type === "category") {
			categories.push(channel);
		}
	}
	var coloredRoles = [], uncoloredRoles = [];
	for (var role of roles) {
		if (role.hexColor === "#000000") {
			uncoloredRoles.push(role);
		}
		else {
			coloredRoles.push(role);
		}
	}
	var staticEmojis = [], animEmojis = [];
	for (var emoji of emojis) {
		if (emoji.animated) {
			animEmojis.push(emoji);
		}
		else {
			staticEmojis.push(emoji);
		}
	}

	var embed, str = "", title = "";
	if (doFull) {
		title = "📛 " + msg.guild.name + " (" + msg.guild.nameAcronym + ")";
	}
	else {
		title = "📛 " + msg.guild.name;
	}

	str += "🆔 **ID**: " + msg.guild.id + "\n";
	str += "👤 **Owner**: " + msg.guild.owner + "\n";
	str += "👪 **Members**: " + members.length + "\n";
	if (doFull) {
		str += "🌐 **Region**: " + msg.guild.region + "\n";
		str += "🤢 **Large**: " + boolean_to_yesno(msg.guild.large) + "\n";
		str += "😲 **Filter Level**: " + msg.guild.explicitContentFilter + "\n";
		str += "📱 **Verification Level**: " + msg.guild.verificationLevel + "\n";
	}
	str += "😂 **Emojis (" + emojis.length + ")**: " + staticEmojis.length + " static, " + animEmojis.length + " animated\n";
	str += "🔤 **Channels (" + channels.length + ")**: " + textChannels.length + " text, " + voiceChannels.length + " voice, " + categories.length + " category\n";
	str += "🚽 **Roles (" + roles.length + ")**: " + coloredRoles.length + " colored, " + uncoloredRoles.length + " uncolored\n";
	str += "📆 **Created**: " + dateFormat(msg.guild.createdAt, "MEDTIMEDATE") + "\n";

	embed = embedify(title, (msg.guild.owner.displayColor ? msg.guild.owner.displayHexColor : "#000000"),
	[
	], "", str, "", "", msg.guild.iconURL(), "", "");
	msg.channel.send({ embed: embed });
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "serverinfo",
	aliases: ["sinfo"],
	category: "Info",
	description: "Prints out information about the server",
	usage: "sinfo [full]"
};