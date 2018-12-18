const { sql, user_form, invalid_usage } = require("../Utils/");

exports.run = async (client, msg, args) => {
	if (args.length < 2) {
		return msg.channel.send("Please provide the abbreviation and the course number, and optionally the section number.");
	}
	const courseEx = /([^\d\W]+)(.+)\s(.+)/g;
	const courseParsed = courseEx.exec(args.splice(1).join(" "));
	if (!courseParsed) {
		return msg.channel.send({ embed: invalid_usage(this) });
	}
	const abbr = courseParsed[1].toUpperCase(), num = courseParsed[2].toUpperCase(), section = courseParsed[3].toUpperCase();
	sql.open("./Objects/coursewatcher.sqlite").then(() => {
		/*
		msgSect	rowSect	add? (section in message; section in any row; add to table?)
		y		y		n (already have that section watched)
		y		n		n (already watching all sections)
		n		y		y (remove sections and add all sections)
		n		n		n (already watching all sections)

		row does not have section --> do not add (watching all sections already)
		row has section
			message has section --> add if sections do not match
			message does not have section --> remove rows with section and add all sections (want to watch all sections instead of current ones)
		*/
		// TODO: if you are watching the entire course but specify adding a section, this will incorrectly add the section!
		(async () => {
			// add user ID to list of watchers
			sql.run("CREATE TABLE IF NOT EXISTS courseWatchUsers (userId TEXT, UNIQUE(userId))").then(() => {
				sql.run("INSERT OR IGNORE INTO courseWatchUsers (userId) VALUES (?)", [msg.author.id]).then(() => {
					console.log("Added " + msg.author.id + " (" + user_form(msg.author) + ") to course watch users table");
				});
			});

			// add specific course/section to watchlist
			var sqlQuery = `SELECT * FROM courseWatch WHERE userId ="${msg.author.id}" AND abbr = "${abbr}" AND num = "${num}"`;
			if (section) {
				sqlQuery += ` AND section = "${section}"`;
			}
			sql.get(sqlQuery).then(row => {
				if (!row) {
					sql.run("INSERT INTO courseWatch (userId, abbr, num, section) VALUES (?, ?, ?, ?)", [msg.author.id, abbr, num, section]).then(() => {
						if (section) {
							msg.channel.send("Added " + abbr + num + " " + section + " to your watchlist!");
						}
						else {
							msg.channel.send("Added " + abbr + num + " to your watchlist!");
						}
						addwatcher_finally();
					});
				}
				else {
					if (section) { // we are already watching this specific section
						msg.channel.send("You are already watching " + abbr + num + " " + section + "!");
						addwatcher_finally();
					}
					else { // we found a row but did not specify a section
						if (row.section) { // we want to watch all but are currently only watching a section
							// delete the current sections being watched
							sql.run(`DELETE FROM courseWatch WHERE userId ="${msg.author.id}" AND abbr = "${abbr}" AND num = "${num}"`).then(() => {
								// add all sections to the watchlist
								sql.run("INSERT INTO courseWatch (userId, abbr, num, section) VALUES (?, ?, ?, ?)", [msg.author.id, abbr, num, section]).then(() => {
									msg.channel.send("Added " + abbr + num + " to your watchlist and cleared old watched sections!");
									addwatcher_finally();
								});
							});
						}
						else { // we want to watch all and are currently already watching all
							msg.channel.send("You are already watching " + abbr + num + "!");
							addwatcher_finally();
						}
					}
				}
			}).catch(() => {
				console.error;
				sql.run("CREATE TABLE IF NOT EXISTS courseWatch (userId TEXT, abbr TEXT, num TEXT, section TEXT)").then(() => {
					sql.run("INSERT INTO courseWatch (userId, abbr, num, section) VALUES (?, ?, ?, ?)", [msg.author.id, abbr, num, section]).then(() => {
						if (section) {
							msg.channel.send("Added " + abbr + num + " " + section + " to your watchlist!");
						}
						else {
							msg.channel.send("Added " + abbr + num + " to your watchlist!");
						}
						addwatcher_finally();
					});
				});
			});
		})();
	});
	function addwatcher_finally() {
		sql.close();
	}
};

exports.config = {
	delete: false,
	hidden: false,
}

exports.help = {
	name: "addwatcher",
	aliases: [],
	category: "Courses",
	description: "Adds a course or course section to be watched",
	usage: "!addwatcher CSE341LR [A1]"
};