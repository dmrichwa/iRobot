const { user_form, embedify } = require("../Utils/");
const { CREATOR_ID } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	if (CREATOR_ID.indexOf(msg.author.id) <= -1) // only bot creator may run this command
		return;
	msg.guild.fetchMembers().then(guild => {
		(async () => {
			var str = "Users: ";
			var count = 0;
			for (var member of guild.members) {
				await new Promise(next => {
					member = member[1];
					if (member.roles.has(args[1])) {
						str += member.toString();
						count++;
						member.removeRole(args[1], "Unassigned role by " + user_form(msg.author)).then(next()).catch(e => {msg.channel.send("Error: " + e);next();});
					}
					else { // skip over
						next();
					}
				});
			}
			var embed = embedify("", "#FFFFFF", [
				["Unassigned role from " + count + " user" + (count === 1 ? "" : "s"), str]
			], "", "", "", "", "", "", "");
			msg.channel.send({ embed: embed });
		})();
	}).catch(console.error);
};

exports.config = {
	delete: false,
	hidden: true,
};

exports.help = {
	name: "unassignroles",
	aliases: [],
	category: "Test",
	description: "Removes a specified role from everyone in the server",
	usage: "unassignroles (id)"
};