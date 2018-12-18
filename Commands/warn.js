const { writeJsonFile, user_form, embedify, invalid_usage, has_permission, get_user } = require("../Utils/");
const { CATEGORIES } = require("../Utils/constants.js");
const { getWarnings } = require("../Objects.js");

exports.run = async (client, msg, args) => {
	if (!has_permission(["KICK_MEMBERS"], msg.member)) {
		return msg.channel.send("Must have Kick Members permission to warn a user");
	}
	if (args.length < 3) {
		return msg.channel.send({ embed: invalid_usage(this) });
	}
	const warnMsg = args.slice(2).join(" ");

	get_user(args[1], msg.guild).then(user => {
		var embed = embedify("", CATEGORIES.STAFF.color,
		[
		], "", "⚠ Warned " + user_form(user) + " (" + user + ") for `" + warnMsg + "`!", "", "", "", "", "");

		msg.channel.send({ embed: embed }).then(message => {
			(async () => {
				embed.description = "⚠ You have been warned for `" + warnMsg + "`!";
				await user.send({ embed: embed });
				var warnings = await getWarnings();
				if (!warnings[user.id]) {
					warnings[user.id] = [];
				}
				warnings[user.id].push({
					id: message.id,
					warner: msg.author.id,
					msg: warnMsg,
					time: Date.now(),
				});
				await writeJsonFile("./Objects/warnings.json", warnings);
			})();
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
	name: "warn",
	aliases: [],
	category: "Staff",
	description: "Warns a user",
	usage: "warn (@user) (reason)"
};