const { embedify, get_role } = require("../Utils/");
const { CATEGORIES } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	get_role(args.splice(1).join(" ").toLowerCase(), msg.guild).then(role => {
		var memArr = [];
		for (var member of msg.guild.members.cache) {
			if (member[1].roles.has(role.id)) {
				memArr.push(member[1]);
			}
		}

		const color = role.hexColor;
		var embed = embedify("", (color === "#000000" ? CATEGORIES.INFO.color : color),
		[
			[role.name, "Users (" + memArr.length + "): " + memArr.join(", "), true, ", "],
		], "", "", "", "", "", "", "");
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
	name: "whois",
	aliases: ["inrole"],
	category: "Info",
	description: "Lists all the users in a given role",
	usage: "whois (role name or ID)"
};