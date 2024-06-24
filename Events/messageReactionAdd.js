const { dateFormat, writeJsonFile, embedify, rainbow } = require("../Utils/");
const { SERV_TYLER, CHAN_TYLER_HALLOFLAME, EMOJI_HALLOFLAME } = require("../Utils/constants.js");
const { tictactoe } = require("../Objects.js");

module.exports = async (client, reaction, user) => {
    if (reaction.message.guild.id === SERV_TYLER) {
		if (reaction.emoji.id === EMOJI_HALLOFLAME && reaction.count <= 1) { // xcuseme / don't add multiple times
			var attach;
			var attachURL = "";
			var attachName = "";
			var attachType = "";
			if (reaction.message.attachments.size > 0) { // if there's an image, add it to the embed
				if (reaction.message.attachments.first().size >= 4500000) {// cap image size to 4.5 MiB to prevent errors
					return reaction.message.channel.send("File size too big! (Must be < 4,500,000 bytes)");
				}
				attach = reaction.message.attachments.first();
				attachURL = attach.url;
				attachName = attach.name;
				
				const attachRegex = /\.(\w+)$/g;
				var fileExt = attachRegex.exec(attachName);
				if (!fileExt) {
					return reaction.message.channel.send("Could not parse file name!");
				}
				fileExt = fileExt[1];
				if (["webm", "mpg", "mp2", "mpeg", "mpe", "mpv", "ogg", "mp4", "m4p", "m4v", "mov"].includes(fileExt)) {
					attachType = "video";
				}
				else if (["tif", "tiff", "gif", "jpeg", "jpg", "jif", "jfif", "jp2", "jpx", "j2k", "j2c", "fpx", "pcd", "png"].includes(fileExt)) {
					attachType = "image";
				}
				else {
					return reaction.message.channel.send("Could not resolve attachment file type!");
				}
			}
			var embed = embedify("", rainbow(25, Math.random() * 25),
			[
			], [reaction.message.author.username, reaction.message.author.avatarURL()], reaction.message.content, dateFormat(reaction.message.createdAt, "MEDTIMEDATE") + " in #" + reaction.message.channel.name, (attachType === "image" ? "attachment://" + attachName : ""), "", "", "", {attachment: attachURL, name: attachName});
			reaction.message.guild.channels.cache.get(CHAN_TYLER_HALLOFLAME).send({ embed: embed }).catch(error => {
				reaction.message.channel.send("Error " + error.code + ": " + error.message);
				console.log(error);
			});
		}
	}
	if ("↖⬆↗⬅⏺➡↙⬇↘".includes(reaction.emoji.name) && user.id !== client.user.id) {
		(async () => {
			for (var game of tictactoe) {
				if (game.msgId === reaction.message.id) {
					reaction.remove(user.id); // remove the reaction to simplify repeating
					if (game.gameOver) { // the game is already complete
						return;
					}
					if (game.turn !== user.id) { // it is not this person's turn, or they are not playing the game
						return;
					}

					const offset = "↖⬆↗⬅⏺➡↙⬇↘".indexOf(reaction.emoji.name); // offset into board string
					if (game.board[offset] === "⬜") { // blank tile, so add that player's symbol
						if (game.turn === game.creator) { // game creator is X
							game.board[offset] = "🇽";
						}
						else { // opponent is O
							game.board[offset] = "🅾";
						}
					}
					else { // tile already occupied, ignore
						return;
					}

					var nextTile = "";
					if (game.turn === game.creator) { // other player's turn
						game.turn = game.opponent;
						nextTile = "🅾";
					}
					else {
						game.turn = game.creator;
						nextTile = "🇽";
					}

					var descString = game.board.map((t, i) => (i % 3 === 2) ? (t + "\n") : t).join("");

					// check gameover conditions
					// check horizontally
					for (var row = 0; row < 3; row++) {
						const spot1 = row * 3;
						const spot2 = row * 3 + 1;
						const spot3 = row * 3 + 2;
						if (game.board[spot1] !== "⬜" && game.board[spot1] === game.board[spot2] && game.board[spot2] === game.board[spot3]) {
							tictactoe_victory(spot1);
							break;
						}
					}
					// check vertically
					for (var col = 0; col < 3; col++) {
						const spot1 = col;
						const spot2 = col + 3;
						const spot3 = col + 6;
						if (game.board[spot1] !== "⬜" && game.board[spot1] === game.board[spot2] && game.board[spot2] === game.board[spot3]) {
							tictactoe_victory(spot1);
							break;
						}
					}
					// check diagonally
					const upLeft = 0;
					const mid = 4;
					const clientRight = 8;
					const upRight = 2;
					const clientLeft = 6;
					if (game.board[mid] !== "⬜" && ((game.board[upLeft] === game.board[mid] && game.board[mid] === game.board[clientRight]) || (game.board[upRight] === game.board[mid] && game.board[mid] === game.board[clientLeft]))) {
						tictactoe_victory(mid);
					}

					function tictactoe_victory(boardPos) {
						if (game.board[boardPos] === "🇽") { // creator won
							descString += client.users.cache.get(game.creator).toString() + " won!";
						}
						else { // opponent won
							descString += client.users.cache.get(game.opponent).toString() + " won!";
						}
						game.gameOver = true;
					}

					if (!game.gameOver) {
						var isFull = true;
						for (var tile of game.board) {
							if (tile === "⬜") {
								isFull = false;
								break;
							}
						}
						if (isFull) {
							descString += "Draw!";
							game.gameOver = true;
						}
						else {
							descString += "It's " + client.users.cache.get(game.turn).toString() + "'s turn! You're " + nextTile;
						}
					}

					game.embed.description = descString;

					reaction.message.edit({ embed: game.embed }).then(message => {
						if (!game.gameOver) {
							return;
						}
						(async () => {
							for (var react of message.reactions.cache) {
								if (react[1].me) {
									await react[1].remove();
								}
							}
						})();
					}).catch(error => {
						console.log("Error: " + error.message);
					});
				}
			}
		})();
	}
};