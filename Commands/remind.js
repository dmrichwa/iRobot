const { dateFormat, writeJsonFile, embedify, invalid_usage } = require("../Utils/");
const { CATEGORIES } = require("../Utils/constants.js");
const { getReminders } = require("../Objects.js");

exports.run = async (client, msg, args) => {
	if (args.length < 3) {
		return msg.channel.send({ embed: invalid_usage(this) });
	}
	const remindMsg = args.slice(1, -1).join(" ");

	const timeEx = /((?:\d+d)?)((?:\d+h)?)((?:\d+m)?)((?:\d+s)?)$/g;
	const timeParsed = timeEx.exec(args.slice(1).join(" "));
	if (!timeParsed) {
		return msg.channel.send({ embed: invalid_usage(this) });
	}
	var days = Number(timeParsed[1].slice(0, -1)), hours = Number(timeParsed[2].slice(0, -1)), mins = Number(timeParsed[3].slice(0, -1)), secs = Number(timeParsed[4].slice(0, -1));
	mins += Math.floor(secs / 60);
	secs = secs % 60;
	hours += Math.floor(mins / 60);
	mins = mins % 60;
	days += Math.floor(hours / 24);
	hours = hours % 24;
	if (days > 730) {
		return msg.channel.send("Cannot set a reminder for more than 2 years from now");
	}
	const now = new Date();
	const remindDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, now.getHours() + hours, now.getMinutes() + mins, now.getSeconds() + secs, 0);
	if (remindDate <= now) {
		return msg.channel.send("Cannot set an immediate reminder, or error parsing time");
	}
	
	var embed = embedify("", CATEGORIES.MISC.color,
	[
	], "", "⏰ Will remind you about `" + remindMsg + "` at " + dateFormat(remindDate, "SHORTTIMEDATEREV"), "", "", "", "", "");

	msg.channel.send({ embed: embed }).then(message => {
		(async () => {
			var reminders = await getReminders();
			reminders[msg.id] = {
				author: msg.author.id,
				tick: Date.now() + (remindDate - now),
				init: Date.now(),
				msg: remindMsg
			};
			await writeJsonFile("./Objects/reminders.json", reminders);
		})();
	});
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "remind",
	aliases: ["remindme", "reminder"],
	category: "Miscellaneous",
	description: "Adds a reminder",
	usage: "remind (message) (2d6h17m4s)"
};