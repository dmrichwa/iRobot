const { writeJsonFile, embedify, invalid_usage } = require("../Utils/");
const { PREFIX, CATEGORIES } = require("../Utils/constants.js");
const { getReminders } = require("../Objects.js");

exports.run = async (client, msg, args) => {
	if (args.length < 2) {
		return msg.channel.send({ embed: invalid_usage(this) });
	}
	const remId = args[1];
	(async () => {
		var remindList = [];
		var reminders = await getReminders();
		for (var msgId in reminders) {
			var reminder = reminders[msgId];
			if (reminder.author === msg.author.id && reminder.init.toString().slice(-4) === remId) {
				var embed = embedify("", CATEGORIES.MISC.color,
				[
				], "", "Reminder " + remId + " (`" + reminder.msg + "`) deleted", "", "", "", "", "");
				msg.channel.send({ embed: embed });
				reminders[msgId] = undefined;
				await writeJsonFile("./Objects/reminders.json", reminders);
				return;
			}
		}
		msg.channel.send("Could not find reminder ID (use " + PREFIX + "remindlist to find the ID)");
	})();
};

exports.config = {
	delete: true,
	hidden: false,
};

exports.help = {
	name: "delreminder",
	aliases: ["deletereminder"],
	category: "Miscellaneous",
	description: "Deletes a reminder",
	usage: "delreminder (reminder Id)"
};