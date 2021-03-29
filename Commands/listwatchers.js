const { sql, sqlite3 } = require("../Utils/");

exports.run = async (client, msg, args) => {
	const safe = args[1] && args[1].toLowerCase() === "safe";
	sql.open({filename: "./Objects/coursewatcher.sqlite", driver: sqlite3.Database}).then((db) => {
		(async () => {
			var str = "";
			db.all(`SELECT * FROM courseWatch WHERE userId ="${msg.author.id}"`).then(rows => {
				for (var row of rows) {
					if (row.section) {
						if (safe) {
							str += "|" + row.abbr + "|" + row.num + "|" + row.section + "|\n";
						}
						else {
							str += row.abbr + row.num + " " + row.section + "\n";
						}
					}
					else {
						if (safe) {
							str += "|" + row.abbr + "|" + row.num + "|\n";
						}
						else {
							str += row.abbr + row.num + "\n";
						}
					}
				}
				if (str === "") { // no rows
					str = "You are not watching any classes!";
				}
			}).catch(error => {
				console.log(error);
			}).then(() => {
				msg.channel.send(str);
				listwatcher_finally(db);
			});
		})();
	});
	function listwatcher_finally(db) {
		db.close();
	}
};

exports.config = {
	delete: false,
	hidden: false,
}

exports.help = {
	name: "listwatchers",
	aliases: ["listwatcher"],
	category: "Courses",
	description: "Lists your active watchers",
	usage: "listwatchers (safe)"
};