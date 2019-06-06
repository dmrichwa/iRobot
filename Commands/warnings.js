const { dateFormat, embedify, has_permission, rainbow, get_user, pluralize } = require("../Utils/");
const { getWarnings } = require("../Objects.js");

exports.run = async (client, msg, args) => {
	if (!has_permission(["KICK_MEMBERS"], msg.member)) {
		return msg.channel.send("Must have Kick Members permission to check warnings");
	}
	get_user(args.slice(1).join(" "), msg.guild, msg.author).then(user => {
		(async () => {
			var warnings = await getWarnings();
			if (!warnings[user.id] || warnings[user.id].length === 0) {
				var embed = embedify("", rainbow(25, Math.random() * 25),
				[
				], ["Warning List", msg.author.avatarURL], "No warnings", "", "", "", "", "");
				return msg.channel.send({ embed: embed });
			}
			var warnList = warnings[user.id];
			warnList.sort((a, b) => {
				return b.id - a.id;
			});
			var str = "";
			for (var warning of warnList) {
				str += "**" + dateFormat(warning.time, "MEDTIMEDATE") + "** by " + client.users.get(warning.warner) +  "\n" + warning.msg + "\n";
			}
			var embed = embedify("", rainbow(25, Math.random() * 25),
			[
			], ["Warning List", user.avatarURL], str, warnList.length + " " + pluralize("warning", "warnings", warnList.length), "", "", "", "");
			msg.channel.send({ embed: embed });
		})();
	}).catch(error => {
		return msg.channel.send("Error: " + error.message);
	});
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "warnings",
	aliases: ["warnlist", "checkwarns", "chkwarns", "chkwarn"],
	category: "Staff",
	description: "Lists warnings for a given user",
	usage: "warnings [@user]"
};