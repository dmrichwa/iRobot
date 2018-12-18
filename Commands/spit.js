exports.run = async (client, msg, args) => {
	var args = msg.content.match(/\S+/gi);
	msg.channel.send(args.join("#"));
};

exports.config = {
	delete: false,
	hidden: true,
};

exports.help = {
	name: "spit",
	aliases: [],
	category: "Test",
	description: "Replaces every space in your message with '#'",
	usage: "spit <message>"
};