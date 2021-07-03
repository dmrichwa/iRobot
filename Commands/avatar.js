const { get_member } = require("../utils/");

exports.run = async (client, msg, args) => {
    get_member(args.splice(1).join(" "), msg.guild, msg.member).then(member => { // try to find the user they want
        msg.channel.send("`" + member.user.username + "`'s avatar: " + member.user.displayAvatarURL({ dynamic: true, size: 4096 }));
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