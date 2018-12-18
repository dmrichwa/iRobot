exports.run = async (client, msg, args) => {
		msg.channel.send("```" + msg.content + "```");
};

exports.config = {
	delete: false,
	hidden: true,
};

exports.help = {
	name: "code",
	aliases: [],
	category: "Test",
	description: "Wraps your message in ```",
	usage: "code <message>"
};