const { user_form, embedify, get_role } = require("../Utils/");
const { CREATOR_ID } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	if (CREATOR_ID.indexOf(msg.author.id) <= -1) {// only bot creator may run this command
		return;
	}
	msg.guild.members.fetch().then(members => {
		get_role(args.splice(1).join(""), msg.guild).then(role => {
			(async () => {
				var str = "Users: ";
				var count = 0;
				for (var member of members) {
					await new Promise(next => {
						member = member[1];
						if (member.roles.size === 1) { // everyone has @everyone
							str += member.toString();
							count++;
							member.roles.add(role, "Assigned role by " + user_form(msg.author)).then(next()).catch(e => {msg.channel.send("Error: " + e);next();});
						}
						else { // skip over
							next();
						}
					});
				}
				var embed = embedify("", "#FFFFFF", [
					["Assigned " + role.name + " to " + count + " user" + (count === 1 ? "" : "s"), str]
				], "", "", "", "", "", "", "");
				msg.channel.send({ embed: embed });
			})();
		});
	}).catch(console.error);
};

exports.config = {
	delete: false,
	hidden: true,
};

exports.help = {
	name: "assignroles",
	aliases: [],
	category: "Test",
	description: "Gives a specified role to everyone in the server who do not have any roles",
	usage: "assignroles (role)"
};