exports.run = async (client, msg, args) => {
	if (!msg.member.hasPermission("BAN_MEMBERS")) return msg.channel.send("BAN_MEMBERS permission denied.");
	msg.channel.send("BAN_MEMBERS permission granted!");
};

exports.config = {
	delete: false,
	hidden: true,
};

exports.help = {
	name: "staffcheck",
	aliases: [],
	category: "Test",
	description: "Checks if you have the BAN MEMBERS permission",
	usage: "staffcheck"
};