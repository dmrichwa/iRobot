const { got, invalid_usage, pluralize } = require("../Utils/");

exports.run = async (client, msg, args) => {
	if (args.length < 3) {
		return msg.channel.send({ embed: invalid_usage(this) });
	}
	(async () => {
		try {
			const courseEx = /([^\d\W]+)(.+)\s(.+)/g;
			const courseParsed = courseEx.exec(args.splice(1).join(" "));
			if (!courseParsed) {
				return msg.channel.send({ embed: invalid_usage(this) });
			}
			const abbr = courseParsed[1], num = courseParsed[2], section = courseParsed[3];
			const url = "https://prv-web.sens.buffalo.edu/apis/schedule2/schedule2/course/semester/spring/abbr/" + abbr + "/num/" + num + "/section/" + section;
			const response = await got(url);
			const parsed = JSON.parse(response.body);
			const openSeats = parsed.enrollment.section - parsed.enrollment.enrolled;
			const seatStr = pluralize("seat", "seats", openSeats);
			var str = parsed.catalog.abbr + parsed.catalog.num + " " + parsed.section + ": "
					+ (openSeats > 0 ? ("**" + openSeats + " open " + seatStr + "!**") : (openSeats + " open " + seatStr))
					+ " (" + parsed.enrollment.enrolled + "/" + parsed.enrollment.section + "; room cap " + parsed.enrollment.room + ")";
			parsed.notes.forEach(note => {
				str += " [Note: " + note.note + "]";
			});
			msg.channel.send(str);
		}
		catch (error) {
			if (error.statusCode) {
				switch (error.statusCode) {
					case 400: // Bad Request -- usually happens if illegal symbols are present
						msg.channel.send({ embed: invalid_usage(this) });
						break;
					case 500: // Internal Server Error -- usually happens if course could not be found
						msg.channel.send("Could not find course");
						break;
					default:
						msg.channel.send(error.toString());
						break;
				}
			}
			else {
				msg.channel.send(error.toString());
			}
			console.log(error);
		}
	})();
};

exports.config = {
	delete: false,
	hidden: false,
}

exports.help = {
	name: "courseinfo",
	aliases: [],
	category: "Courses",
	description: "Provides seating information about a specific course",
	usage: "courseinfo CSE341LR A1"
};