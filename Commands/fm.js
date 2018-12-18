const { sql, dateFormat, embedify, get_color_from_URL, rainbow } = require("../Utils/");
const { lastfm } = require("../Objects.js");

exports.run = async (client, msg, args) => {
    if (args[1] && args[1].toLowerCase() === "set") { // set or update username
        if (!args[2]) {
            return msg.channel.send("Please specify a username to set");
        }
        sql.open("./Objects/lastfm.sqlite").then(() => {
            (async () => {
                sql.get(`SELECT * FROM lastfmUsernames WHERE userId ="${msg.author.id}"`).then(row => {
                    if (!row) {
                        sql.run("INSERT INTO lastfmUsernames (userId, fmName) VALUES (?, ?)", [msg.author.id, args[2]]).then(() => {
                            msg.channel.send("Set last.fm username to " + args[2]);
                            fm_finally();
                        });
                    }
                    else { // user already set their username
                        sql.run("UPDATE lastfmUsernames SET fmName = '" + args[2] + "' WHERE userId = '" + msg.author.id + "'").then(() => {
                            msg.channel.send("Updated last.fm username to " + args[2]);
                            fm_finally();
                        });
                    }
                }).catch(error => {
                    console.log(error);
                    sql.run("CREATE TABLE IF NOT EXISTS lastfmUsernames (userId TEXT, fmName TEXT)").then(() => {
                        sql.run("INSERT INTO lastfmUsernames (userId, fmName) VALUES (?, ?)", [msg.author.id, args[2]]).then(() => {
                            msg.channel.send("Set last.fm username to " + args[2]);
                            fm_finally();
                        });
                    });
                });
            })();
        });
    }
    else { // get currently playing song
        if (args.length === 1) { // no name specified -- use lookup
            sql.open("./Objects/lastfm.sqlite").then(() => {
                (async () => {
                    sql.get(`SELECT * FROM lastfmUsernames WHERE userId ="${msg.author.id}"`).then(row => {
                        if (!row) { // username not found
                            msg.channel.send("Please set a username using !fm set (name)");
                            fm_finally();
                        }
                        else {
                            fm_handle(row.fmName).then(() => fm_finally());
                        }
                    });
                })();
            });
        }
        else {// name specified -- use that name
            fm_handle(args[1]);
        }

        async function fm_handle(username) {
            lastfm.request("user.getInfo", {
                user: username,
                handlers: {
                    success: function(data) {
                        var streamer = lastfm.stream(username);
                        var avatarUrl = data.user.image[0]["#text"];
                        var scrobbleCount = data.user.playcount;
                        streamer.on("nowPlaying", async function(track) {
                            try {
                                    var trackImage = track.image[2]["#text"];
                                    if (trackImage === "") {
                                        //trackImage = "https://cdn.browshot.com/static/images/not-found.png";
                                        trackImage = "https://lastfm-img2.akamaized.net/i/u/64s/4128a6eb29f94943c9d206c08e625904";
                                    }
                                    var trackDate = (track.date ? "Played on " + dateFormat(track.date["#text"], "MEDTIMEDATE") : "**Now playing**");
                                    var avgColor, didError = false;
                                    try {
                                        avgColor = await get_color_from_URL(trackImage);
                                    }
                                    catch (error) {
                                        console.log("Error: " + error);
                                        didError = true;
                                        avgColor = rainbow(25, Math.random(25));
                                    }
                                    var embed = embedify("", avgColor,
                                    [
                                        ["Track", track.name, true],
                                        ["Artist", track.artist["#text"], true],
                                    ], ["Last track for " + username, avatarUrl, "http://last.fm/user/" + username], trackDate, scrobbleCount.toLocaleString() + " scrobbles" + (didError ? " • Failed to load track image" : ""), "", trackImage, "", "");
                                    msg.channel.send({ embed: embed });
                            }
                            catch (error) {
                                msg.channel.send("This user has not scrobbled anything yet.");
                                console.log("Error: " + error)
                            }
                        });
                        streamer.on("error", function(error) {
                            msg.channel.send("Error: " + error.message);
                        });
                        streamer.start();
                        streamer.stop();
                    },
                    error: function(error) {
                        msg.channel.send("Error: " + error.message);
                    }
                }
            });
        }
    }
    function fm_finally() {
        sql.close();
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