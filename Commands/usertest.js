const { user_form } = require("../Utils/");

exports.run = async (client, msg, args) => {
	msg.channel.send("Member: " + user_form(msg.guild.owner));
	msg.channel.send("User: " + user_form(msg.author));
	msg.channel.send("Random text: " + user_form("hey"));
	msg.channel.send("Nothing: " + user_form());
};

exports.config = {
	delete: false,
	hidden: true,
};

exports.help = {
	name: "usertest",
	aliases: [],
	category: "Test",
	description: "Tests out the user_form function",
	usage: "usertest"
};