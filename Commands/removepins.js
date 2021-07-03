const { pluralize } = require("../Utils/");
const { CREATOR_ID } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	if (CREATOR_ID.indexOf(msg.author.id) <= -1) {
		return msg.channel.send("Must be bot creator to use this command.");
	}
	msg.channel.messages.fetchPinned().then(messages => {
		(async () => {
			let count = 0;
			for (let message of messages) {
				message = message[1]; // [Snowflake, Message]
				await new Promise(next => {
					message.unpin().then(() => {
						count++;
						next();
					});
				});
			}
			msg.channel.send("Unpinned " + count + " " + pluralize("message", "messages", count));
		})();
	});
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "removepins",
	aliases: [],
	category: "Staff",
	description: "Removes all pins from a channel",
	usage: "removepins"
};