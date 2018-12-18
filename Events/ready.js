const { sql, got, dateFormat, writeJsonFile, user_form, get_user } = require("../Utils/");
const { getReminders } = require("../Objects.js");

module.exports = async (client, msg) => {
	console.log("Starting at " + dateFormat(Date.now(), "LONGTIMEDATE"));
	console.log("Starting timers...");
	spawn_timers();
	console.log("Ready!");
};

/**
 * Spawns all the timers needed for the bot
 */
function spawn_timers() {
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

	// course watcher
	if (!courseWatcher) {
		return;
	}
	function course_watcher() {
		sql.open("./Objects/coursewatcher.sqlite").then(() => {
			(async () => {
				sql.all(`SELECT * FROM courseWatchUsers`).then(userRows => {
					for (var userRow of userRows) {
						console.log("Going through course watchlist for " + userRow.userId);
						sql.all(`SELECT * FROM courseWatch WHERE userId ="${userRow.userId}"`).then(rows => {
							(async () => {
								var classList = [];
								var skipList = [];
								var thisUser = "";
								if (rows.length > 0) {
									thisUser = rows[0].userId;
								}
								for (var row of rows) {
									await new Promise(next => {
										if (!row.section) {
											skipList.push(row.abbr + row.num + " skipped because it has no section (not implemented yet)");
											return next();
										}
										var url = "https://prv-web.sens.buffalo.edu/apis/schedule2/schedule2/course/semester/spring/abbr/" + row.abbr + "/num/" + row.num + "/section/" + row.section;

										(async () => {
											try {
												const response = await got(url);
												var parsed = JSON.parse(response.body);
												var openSeats = parsed.enrollment.section - parsed.enrollment.enrolled;
												var seatStr = "seat" + (openSeats === 1 ? "" : "s");
												var str = parsed.catalog.abbr + parsed.catalog.num + " " + parsed.section + ": " + (openSeats > 0 ? ("**" + openSeats + " open " + seatStr + "!**") : openSeats + " open " + seatStr) + " (" + parsed.enrollment.enrolled + "/" + parsed.enrollment.section + "; room cap " + parsed.enrollment.room + ")";
												parsed.notes.forEach(function (e) {
													str += " [Note: " + e.note + "]";
												});
												classList.push(str);
												next();
											}
											catch (error) {
												console.log(error.toString());
												next();
											}
										})();
									});
								}
								if (thisUser !== "" && classList.length !== 0) { // TODO: users with no more watchers should be removed from the JSON file
									client.fetchUser(thisUser).then(user => {
										console.log("Sending course watchlist to " + user_form(user));
										var date = new Date();
										var month = date.getMonth() + 1;
										var day	= date.getDate();
										day = (day < 10 ? "0" : "") + day;
										var str = "Course watchlist for " + month + "/" + day + ":\n";
										str += classList.sort().join("\n");
										str += "\n" + skipList.sort().join("\n");
										user.send(str).catch(error => {
											console.log("Could not send reminder to " + user_form(user) + " (probably blocked)");
										});
									});
								}
							})();
						});
					}
				});
			})();
		});
	}
	// run every 12:05 PM -- timeout until first instance and then repeat every 24 hours
	var now = new Date();
	var millisTill = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 5, 0, 0) - now;
	if (millisTill < 0) { // it has passed that given time today, try again tomorrow
		millisTill += 86400000;
	}
	setTimeout(function() {
		course_watcher();
		setInterval(course_watcher, 24*60*60*1000);
	}, millisTill);
}