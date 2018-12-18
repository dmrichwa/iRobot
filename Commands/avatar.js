const { get_user } = require("../utils/");

exports.run = async (client, msg, args) => {
    get_user(args.splice(1).join(" "), msg.guild, msg.author).then(user => { // try to find the user they want
        msg.channel.send("`" + user.username + "`'s avatar: " + user.displayAvatarURL);
    }).catch(error => { // could not find user
        msg.channel.send("Error: " + error.message);
    })
};

exports.config = {
    delete: false,
    hidden: false,
}

exports.help = {
    name: "avatar",
    aliases: ["av", "avi", "pfp"],
    category: "Basic",
    description: "Gives a link to someone's avatar",
    usage: "avatar (user)"
};