const { dateFormat, embedify } = require("../Utils/");
const { CATEGORIES } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	// DEBUG FIXME finish this
	return;
	(async function()
	{
		await new Promise(next =>
		{
			channel.messages.fetch( { limit: 1, around: messageId } ).then(messages =>
			{
				if (messages.get(messageId))
				{
					var message = messages.get(messageId);
					var jumpToLink = "https://discordapp.com/channels/" + message.guild.id + "/" + message.channel.id + "/" + message.id;
					var embed = embedify("", CATEGORIES.MISC.color,
					[
						
					], [message.author.username, message.author.avatarURL()], message.content, dateFormat(message.createdAt, "MEDTIMEDATE") + " in #" + channel.name, "", "", "", "");
					msg.channel.send({ embed: embed });
				}
				else
				{
					msg.channel.send("Message not found (if you are trying to quote a message from another channel, make sure you include that channel's ID in the second argument)");
				}
			}).catch(console.error);
		})
	})();
};

exports.config = {
	delete: false,
	hidden: true,
};

exports.help = {
	name: "lastseen",
	aliases: ["lastmsg"],
	category: "Info",
	description: "Finds the date of the last message from a given user",
	usage: "lastseen (user)"
};