const { embedify, invalid_usage, get_member } = require("../utils/");
const { CATEGORIES } = require("../utils/constants.js");
const { tictactoe } = require("../Objects.js");

exports.run = async (client, msg, args) => {
    // TODO: allow open match if no user specified
    if (args.length < 2) {
        return msg.channel.send({ embed: invalid_usage(this) });
    }
    get_member(args.slice(1).join(" "), msg.guild).then(member => {
        if (member.id === msg.author.id) {
            return msg.channel.send("You cannot play against yourself.");
        }
        var desc = "Setting up board...";
        var embed = embedify("Tic-Tac-Toe between " + msg.member.displayName + " and " + member.displayName, CATEGORIES.GAMES.color,
        [
        ], "", desc, "", "", "", "", "");

        msg.channel.send({ embed: embed }).then(message => {
            (async () => {
                await message.react("↖");
                await message.react("⬆");
                await message.react("↗");
                await message.react("⬅");
                await message.react("⏺");
                await message.react("➡");
                await message.react("↙");
                await message.react("⬇");
                await message.react("↘");
                embed.description = "⬜⬜⬜\n⬜⬜⬜\n⬜⬜⬜\nIt's " + member.toString() + "'s turn! You're 🅾";
                message.edit({ embed: embed }).then(message => {
                    tictactoe.push({
                        msgId: message.id,
                        embed: embed,
                        creator: msg.author.id,
                        opponent: member.id,
                        turn: member.id,
                        board: [..."⬜⬜⬜⬜⬜⬜⬜⬜⬜"],
                        gameOver: false,
                    });
                });
            })();
        });
    }).catch(error => {
        msg.channel.send("Error: " + error.message);
    });
};

exports.config = {
    delete: false,
    hidden: false,
}

exports.help = {
    name: "tictactoe",
    aliases: ["ttt"],
    category: "Games",
    description: "Starts a game of tic-tac-toe",
    usage: "tictactoe [user]"
};