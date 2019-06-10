const { has_permission, pluralize } = require("../Utils/");

exports.run = async (client, msg, args) => {
		if (!has_permission(["BAN_MEMBERS"], msg.member)) {
			return msg.channel.send("You must have Ban Members permission to prune.");
		}
		var amount = args[1] && (Number(args[1]) + 1);
		if (!amount || isNaN(amount) || amount < 0) {
			return msg.channel.send("Please input a valid amount to delete.");
		}
		if (amount > 100) {
			amount = 100;
		}
		msg.channel.bulkDelete(amount).then(msgs => {
			if (!msgs) {
				msg.channel.send("Deleted no messages");
			}
			else {
				msg.channel.send("Deleted " + msgs.size + " " + pluralize("message", "messages", msgs.size));
			}
		}).catch(error => {
			msg.channel.send("Error: " + error.message);
		});
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "prune",
	aliases: [],
	category: "Staff",
	description: "Bulk deletes messages",
	usage: "prune 50"
};