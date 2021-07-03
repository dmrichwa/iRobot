const { embedify, rainbow } = require("../Utils/");
const { SERV_UB, CHAN_UB_SUGGEST, EMOJI_UPVOTE, EMOJI_DOWNVOTE } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	var channelId = "";
	switch (msg.guild.id) {
		case SERV_UB: // UBreddit
			channelId = CHAN_UB_SUGGEST; // general-suggestions
			break;
		default:
			channelId = "";
			break;
	}
	if (channelId === "") {
		return msg.channel.send("Command not enabled for this server");
	}
	if (msg.channel.id !== channelId) {
		return msg.channel.send("Command not enabled in this channel");
	}
	const color = rainbow(25, Math.random() * 25);
	const suggestion = args.splice(1).join(" "); // remove command from the suggestion
	var image = "";
	if (msg.attachments.size > 0) { // if there's an image, add it to the embed
		image = msg.attachments.first().url;
	}
	var embed = embedify("", color,
	[
		
	], ["Suggestion from " + msg.author.username, msg.author.avatarURL()], suggestion, "", "attachment://image.jpg", "", "", "", {attachment: image, name: "image.jpg"});
	msg.guild.channels.cache.get(channelId).send({ embed: embed }).then(sentMsg => { // add upvote and downvote
		sentMsg.react(EMOJI_UPVOTE).then(() => {
			sentMsg.react(EMOJI_DOWNVOTE);
		});
	});
};

exports.config = {
	delete: true,
	hidden: false,
};

exports.help = {
	name: "suggest",
	aliases: ["suggestion"],
	category: "Miscellaneous",
	description: "Submits a suggestion",
	usage: "suggest [message]"
};