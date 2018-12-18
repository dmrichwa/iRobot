const { dateFormat, embedify, get_role, boolean_to_yesno } = require("../Utils/");
const { CATEGORIES } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	var highRole;
	msg.guild.roles.forEach(role => {
		if (!highRole || role.position > highRole.position) {
			highRole = role;
		}
	});
	const doFull = args[1] && args[1].toLowerCase() === "full" && args[2]; // allow to lookup a role called (fuzzily) "full" if nothing else follows
	var input;
	if (doFull) {
		input = args.splice(2).join(" ");
	}
	else {
		input = args.splice(1).join(" ");
	}
	get_role(input, msg.guild).then(role => {
		const color = role.hexColor;
		var str = "🆔 **ID**: " + role.id + "\n"
		str += "🌈 **Color**: " + (color === "#000000" ? "None" : color) + "\n"
		str += "👪 **Members**: " + role.members.size + " / " + msg.guild.members.size + " (" + Math.round(role.members.size / msg.guild.members.size * 10 * 100) / 10 + "%)\n"
		if (doFull) {
			str += "🏅 **Position**: " + role.position + " / " + highRole.position + "\n"
			str += "👺 **Mentionable**: " + boolean_to_yesno(role.mentionable) + "\n"
			str += "🏳 **Hoisted**: " + boolean_to_yesno(role.hoist) + "\n"
		}
		str += "📆 **Created**: " + dateFormat(role.createdAt, "MEDTIMEDATE");
		var embed = embedify("@" + role.name, (color === "#000000" ? CATEGORIES.INFO.color : color), [ ], "", str, "", "", "", "", "");
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
	name: "roleinfo",
	aliases: ["rinfo"],
	category: "Info",
	description: "Gives information about a certain role",
	usage: "rinfo (full) (role name or ID)"
};