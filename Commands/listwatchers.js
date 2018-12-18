const { sql } = require("../Utils/");

exports.run = async (client, msg, args) => {
	const safe = args[1] && args[1].toLowerCase() === "safe";
	sql.open("./Objects/coursewatcher.sqlite").then(() => {
		(async () => {
			var str = "";
			sql.all(`SELECT * FROM courseWatch WHERE userId ="${msg.author.id}"`).then(rows => {
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
				listwatcher_finally();
			});
		})();
	});
	function listwatcher_finally() {
		sql.close();
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
	usage: "!listwatchers (safe)"
};