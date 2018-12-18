exports.run = async (client, msg, args) => {
	var user;
	client.fetchUser(args[1]).then((x) => {
		user = x;
		msg.channel.send("Fetched!");
	}).catch((e) => {
		msg.channel.send("Error fetching: " + e);
	})
	if (user)
		msg.channel.send("Username: " + user.username);
	else
		msg.channel.send("No user");
};

exports.config = {
	delete: false,
	hidden: true,
};

exports.help = {
	name: "getuser",
	aliases: [],
	category: "Test",
	description: "Grabs a User object by user ID",
	usage: "getuser (id)"
};