exports.run = async (client, msg, args) => {
    const message = await msg.channel.send("Ping?");
    message.edit(`Pong! Latency is ${message.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
};

exports.config = {
    delete: false,
    hidden: false,
}

exports.help = {
    name: "ping",
    aliases: [],
    category: "Miscellaneous",
    description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
    usage: "ping"
};