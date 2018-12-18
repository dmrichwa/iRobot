const { embedify } = require("../Utils/");

exports.run = async (client, msg, args) => {
	var embed = embedify("boo", "#FFFFFF", [
		
	], "boo", "", "", "", "", "", "");
	msg.channel.send({ embed: embed }).then(message => {
		embed.addField("yeah", "yeah!", true);
		message.edit({ embed: embed }).then(message => {
			embed.addField("woah", "woahhhhh", true);
			message.edit({ embed: embed });
		})
	});
};

exports.config = {
	delete: false,
	hidden: true,
};

exports.help = {
	name: "video",
	aliases: [],
	category: "Test",
	description: "Tests trying to update an embed",
	usage: "video"
};