const { got, dateFormat, embedify, invalid_usage, rainbow } = require("../Utils/");

exports.run = async (client, msg, args) => {
	(async () => {
		if (args.length < 2) {
			return msg.channel.send(invalid_usage(this));
		}
		const input = args.splice(1).join(" ");
		const url = "http://api.urbandictionary.com/v0/define?term=" + encodeURIComponent(input);
		var response;
		try {
			response = await got(url);
		}
		catch (error) {
			console.log(error);
			return msg.channel.send(error);
		}
		if (!response) {
			return msg.channel.send("Could not load definition");
		}
		try {
			const parsed = JSON.parse(response.body);
			if (!parsed.list || parsed.list.length === 0) {
				return msg.channel.send("No definition found for `" + input + "`");
			}
			const item = parsed.list[0];
			var embed = embedify(item.word, rainbow(25, Math.random() * 25), [
				["Example", item.example.replace(/\[/g, "").replace(/\]/g, "")]
			], "", item.definition.replace(/\[/g, "").replace(/\]/g, ""), "👍 " + item.thumbs_up + " / " + item.thumbs_down + " 👎 • 🕒 " + dateFormat(item.written_on, "mediumDate") + " • 🖊 " + item.author, "", "", "", "");
			msg.channel.send({ embed: embed });
		}
		catch (error) {
			console.log(error);
			return msg.channel.send(error.name + ": " + error.message);
		}
	})();
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "urban",
	aliases: ["ud", "urbandictionary"],
	category: "Miscellaneous",
	description: "Grabs an Urban Dictionary definition",
	usage: "urban (word)"
};