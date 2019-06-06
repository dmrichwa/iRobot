const { embedify, rainbow, get_user, pluralize } = require("../Utils/");
const { getReminders } = require("../Objects.js");

exports.run = async (client, msg, args) => {
	(async () => {
		let remindList = [];
		let reminders = await getReminders();
		for (let msgId in reminders) {
			let reminder = reminders[msgId]
			await new Promise(next => {
				get_user(reminder.author).then(user => {
					if (user === msg.author) {
						remindList.push(reminder);
						next();
					}
					else {
						next();
					}
				}).catch(error => {
					console.log("[Reminder List] Could not find user " + reminder.author);
					next();
				});
			});
		}
		remindList.sort((a, b) => a.tick - b.tick);
		let str = "";
		let index = 0;
		for (let reminder of remindList) {
			index++;
			const millisTill = reminder.tick - new Date();
			const secs = Math.floor((millisTill / 1000) % 60),
				mins = Math.floor(millisTill / (1000 * 60) % 60),
				hours = Math.floor(millisTill / (1000 * 60 * 60) % 24),
				days = Math.floor(millisTill / (1000 * 60 * 60 * 24));
			let timestamp = "";
			if (days !== 0) {
				timestamp += days + "d";
			}
			if (hours !== 0) {
				timestamp += hours + "h";
			}
			if (mins !== 0) {
				timestamp += mins + "m";
			}
			if (secs !== 0) {
				timestamp += secs + "s";
			}
			if (timestamp === "" || millisTill < 0) { // if the string couldn't build or if the reminder already passed, clamp to 0s
				timestamp = "0s";
			}
			index = reminder.init.toString().slice(-4);
			str += "[" + index + "] **" + timestamp + "** " + reminder.msg + "\n";
		}
		let embed = embedify("", rainbow(25, Math.random() * 25),
		[
		], ["Reminder List", msg.author.avatarURL], str, remindList.length + " " + pluralize("reminder", "reminders", remindList.length), "", "", "", "");
		msg.channel.send({ embed: embed });
	})();
};

exports.config = {
	delete: true,
	hidden: false,
};

exports.help = {
	name: "reminders",
	aliases: ["remindlist", "reminderlist", "reminderslist"],
	category: "Miscellaneous",
	description: "Lists your currently active reminders",
	usage: "reminders"
};