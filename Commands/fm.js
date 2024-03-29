const { sql, dateFormat, embedify, get_color_from_URL, rainbow, sqlite3 } = require("../Utils/");
const { lastfm } = require("../Objects.js");

exports.run = async (client, msg, args) => {
    if (args[1] && args[1].toLowerCase() === "set") { // set or update username
        if (!args[2]) {
            return msg.channel.send("Please specify a username to set");
        }
        sql.open({filename: "./Objects/lastfm.sqlite", driver: sqlite3.Database}).then((db) => {
            (async () => {
                db.get(`SELECT * FROM lastfmUsernames WHERE userId ="${msg.author.id}"`).then(row => {
                    if (!row) {
                        db.run("INSERT INTO lastfmUsernames (userId, fmName) VALUES (?, ?)", [msg.author.id, args[2]]).then(() => {
                            msg.channel.send("Set last.fm username to " + args[2]);
                            fm_finally(db);
                        });
                    }
                    else { // user already set their username
                        db.run("UPDATE lastfmUsernames SET fmName = '" + args[2] + "' WHERE userId = '" + msg.author.id + "'").then(() => {
                            msg.channel.send("Updated last.fm username to " + args[2]);
                            fm_finally(db);
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    db.run("CREATE TABLE IF NOT EXISTS lastfmUsernames (userId TEXT, fmName TEXT)").then(() => {
                        db.run("INSERT INTO lastfmUsernames (userId, fmName) VALUES (?, ?)", [msg.author.id, args[2]]).then(() => {
                            msg.channel.send("Set last.fm username to " + args[2]);
                            fm_finally(db);
                        });
                    });
                });
            })();
        });
    }
    else { // get currently playing song
        if (args.length === 1) { // no name specified -- use lookup
            sql.open({filename: "./Objects/lastfm.sqlite", driver: sqlite3.Database}).then((db) => {
                (async () => {
                    db.get(`SELECT * FROM lastfmUsernames WHERE userId ="${msg.author.id}"`).then(row => {
                        if (!row) { // username not found
                            msg.channel.send("Please set a username using !fm set (name)");
                            fm_finally(db);
                        }
                        else {
                            fm_handle(row.fmName).then(() => fm_finally(db));
                        }
                    });
                })();
            });
        }
        else {// name specified -- use that name
            fm_handle(args[1]);
        }

        async function fm_handle(username) {
            // TODO: Re-add grabbing avatar URL
            // user.getInfo
            // avatarUrl = data.user.image[0]["#text"];
            lastfm.request("user.getrecenttracks", {
                user: username,
                handlers: {
                    success: async function(data) {
                        try {
                            let info = data.recenttracks;
                            let scrobbleCount = info["@attr"].total;

                            let track = { album: info.track[0].album["#text"], artist: info.track[0].artist["#text"], name: info.track[0].name, image: info.track[0].image.pop()["#text"], date: info.track[0].date};
                            
                            if (track.image === "") {
                                track.image = "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png";
                            }

                            let trackDate = (track.date ? "Played on " + dateFormat(track.date["#text"], "MEDTIMEDATE") : "**Now playing**");
                            let avgColor, didError = false;
                            try {
                                avgColor = await get_color_from_URL(track.image);
                            }
                            catch (error) {
                                console.log("Error: " + error);
                                didError = true;
                                track.image = "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png";
                                avgColor = rainbow(25, Math.random(25));
                            }
                            var embed = embedify("", avgColor,
                            [
                                ["Track", track.name ? track.name : "No Name", true],
                                ["Album", track.album ? track.album : "No Album", true],
                                ["Artist", track.artist ? track.artist : "No Artist", true],
                            ], ["Last track for " + username, client.user.displayAvatarURL(), "http://last.fm/user/" + username], trackDate, scrobbleCount.toLocaleString() + " scrobbles" + (didError ? " • Failed to load track image" : ""), "", track.image, "", "");
                            msg.channel.send({ embed: embed });
                        }
                        catch (error) {
                            msg.channel.send("This user has not scrobbled anything yet.");
                            console.log("Error: " + error)
                        }
                    },
                    error: function(error) {
                        msg.channel.send("Error: " + error.message);
                    }
                }
            });
        }
    }
    function fm_finally(db) {
        db.close();
    }
};

exports.config = {
    delete: false,
    hidden: false,
}

exports.help = {
    name: "fm",
    aliases: [],
    category: "Basic",
    description: "Gets current song from last.fm",
    usage: "fm (set) (username)"
};