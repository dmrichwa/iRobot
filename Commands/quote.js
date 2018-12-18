const { dateFormat, embedify, invalid_usage, rainbow } = require("../Utils/");

exports.run = async (client, msg, args) => {
	if (args.length < 2) {
		return msg.channel.send({ embed: invalid_usage(this) });
	}
	const messageId = args[1];
	const channel = (args.length >= 3 ? msg.guild.channels.get(args[2]) : msg.channel);
	if (!channel) { // could not find channel
		return msg.channel.send("Could not find channel");
	}
	if (isNaN(messageId)) {
		return msg.channel.send("Please input a number representing the message ID.");
	}
	(async () => {
		await new Promise(next => {
			channel.fetchMessages({ limit: 1, around: messageId }).then(messages => {
				if (messages.get(messageId)) {
					const message = messages.get(messageId);
					//TODO: once updated to discord.js v11.4, this can just be msg.url()
					//const jumpToLink = "https://discordapp.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + message.id;
					var embed = embedify("", (message.member ? message.member.displayHexColor : rainbow(25 * Math.random(25))),
					[
					], [message.author.username, message.author.avatarURL], message.content, dateFormat(message.createdAt, "MEDTIMEDATE") + " in #" + channel.name, "", "", "", "");
					msg.channel.send({ embed: embed });
				}
				else {
					msg.channel.send("Message not found (if you are trying to quote a message from another channel, make sure you include that channel's ID in the second argument)");
				}
			}).catch(console.error);
		})
	})();
};

exports.config = {
	delete: true,
	hidden: false,
};

exports.help = {
	name: "quote",
	aliases: [],
	category: "Miscellaneous",
	description: "Quotes a message by ID",
	usage: "quote [messageId] (channelId)"
};