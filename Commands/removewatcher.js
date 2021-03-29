const { sql, invalid_usage, sqlite3 } = require("../Utils/");

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
	// TODO: Remove user from watcherlist if they have no more courses they are watching!
	sql.open({filename: "./Objects/coursewatcher.sqlite", driver: sqlite3.Database}).then((db) => {
		(async () => {
			var sqlQuery = `SELECT * FROM courseWatch WHERE userId ="${msg.author.id}" AND abbr = "${abbr}" AND num = "${num}"`;
			if (section) {
				sqlQuery += ` AND section = "${section}"`;
			}
			db.get(sqlQuery).then(row => {
				if (!row) { // we are not already watching this section
					if (section) {
						msg.channel.send("You are already not watching " + abbr + num + " " + section + "!");
					}
					else {
						msg.channel.send("You are already not watching " + abbr + num + "!");
					}
					remwatcher_finally(db);
				}
				else {
					sqlQuery = `DELETE FROM courseWatch WHERE userId ="${msg.author.id}" AND abbr = "${abbr}" AND num = "${num}"`;
					if (section) {
						sqlQuery += ` AND section = "${section}"`;
					}
					db.run(sqlQuery).then(() => {
						if (section) {
							msg.channel.send("Removed " + abbr + num + " " + section + " from your watchlist!");
						}
						else {
							msg.channel.send("Removed " + abbr + num + " from your watchlist!");
						}
						remwatcher_finally(db);
					});
				}
			}).catch(error => {
				console.log(error);
			});
		})();
	});
	function remwatcher_finally(db) {
		db.close();
	}
};

exports.config = {
	delete: false,
	hidden: false,
}

exports.help = {
	name: "removewatcher",
	aliases: ["remwatcher"],
	category: "Courses",
	description: "Removes a course from your watcher list.",
	usage: "remwatcher CSE341LR [A1]"
};