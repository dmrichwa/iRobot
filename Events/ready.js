const { sql, got, dateFormat, writeJsonFile, user_form, get_user, sqlite3 } = require("../Utils/");
const { getReminders } = require("../Objects.js");

module.exports = async (client, msg) => {
	console.log("Starting at " + dateFormat(Date.now(), "LONGTIMEDATE"));
	console.log("Starting timers...");
	spawn_timers(client);
	console.log("Ready!");
};

/**
 * Spawns all the timers needed for the bot
 */
function spawn_timers(client) {
	// reminders
	function reminders() {
		(async () => {
			var reminders = await getReminders();
			var writeToFile = false;
			for (var msgId in reminders) {
				var reminder = reminders[msgId];
				await new Promise(next => {
					if (Date.now() >= reminder.tick) { // reminder has passed, time to send message!
						get_user(reminder.author).then(user => {
							console.log("Sending reminder to " + user_form(user));
							user.send("⏰ **Reminder** from " + dateFormat(reminder.init, "MEDTIMEDATE") + ": " + reminder.msg).catch(error => {
								console.log("Could not send reminder to " + user_form(user) + " (probably blocked");
							});
							reminders[msgId] = undefined;
							writeToFile = true;
							next();
						}).catch(error => {
							console.log("[Reminders] Could not find user " + reminder.author);
							next();
						});
					}
					else { // reminder is still in the future, ignore
						next();
					}
				});
			}
			if (writeToFile) { // update the reminders file
				await writeJsonFile("./Objects/reminders.json", reminders);
			}
		})();
	}
	setInterval(reminders, 10*1000); // runs every 10 seconds
}