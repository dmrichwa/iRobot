const { embedify, get_role_array, format_role } = require("../Utils/");
const { CATEGORIES } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	const doId = args[1] && args[1].toLowerCase() === "id";
	var str = "";
	var count = 0;
	for (var role of get_role_array(msg.guild)) {
		count++; // increase count
		str += format_role(role, doId, true) + "\n";
	}
	if (count === 0) {
		str = "None";
	}
	var embed = embedify("", CATEGORIES.INFO.color, [["All Roles", str, true]], "", "", count + " role" + (count == 1 ? "" : "s"), "", "", "", "");
	msg.channel.send({ embed: embed });
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "roles",
	aliases: ["rlist"],
	category: "Info",
	description: "Prints out every role, and optionally their ID",
	usage: "rlist (id)"
};