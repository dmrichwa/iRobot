const { embedify, get_role_array, format_role } = require("../Utils/");
const { CATEGORIES } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	const doId = (args[1] && args[1].toLowerCase() === "id");
	var str = "";
	for (var role of get_role_array(msg.guild)) {
		if (role.members.size === 0) {
			str += format_role(role, doId, true) + "\n";
		}
	}
	var embed = embedify("", CATEGORIES.INFO.color,
	[
		["Empty Roles", str, true, "\n"],
	], "", "", "", "", "", "", "");
	msg.channel.send({ embed: embed });
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "emptyroles",
	aliases: ["empty"],
	category: "Info",
	description: "Lists all roles which have no members assigned to them",
	usage: "emptyroles (id)"
};