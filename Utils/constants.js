exports.PREFIX = "!";

exports.CREATOR_ID = ["163896237479690240", "232337351760805888"]; // user IDs of bot creator
exports.EMBED_FIELD_LENGTH = 5700; // maximum length of all field values (not including titles)

SERV_UB = "412821064607858698"; // UBreddit
SERV_TYLER = "332922421382479882"; // tylersters
exports.SERV_UB = SERV_UB;
exports.SERV_TYLER = SERV_TYLER;

exports.ROLE_UB_MUTE = "432405235819085824"; // mute role
exports.ROLE_UB_UNASS = "416690774835724289"; // unassigned role

exports.CHAN_UB_WELCOME = "553716130645278720"; // welcome channel (welcome)
exports.CHAN_UB_SUGGEST = "414993916790571027"; // suggestions
exports.CHAN_UB_FOOD = "484371390015995904"; // food drive
exports.CHAN_TYLER_HALLOFLAME = "467523175111196672"; // hall-of-lame

CHAN_UB_ANNOUNCE = "483299672320901159"; // UB bot-announcements
CHAN_TYLER_ANNOUNCE = "332938934634020864"; // tylersters announcements
exports.CHAN_UB_ANNOUNCE = CHAN_UB_ANNOUNCE;
exports.CHAN_TYLER_ANNOUNCE = CHAN_TYLER_ANNOUNCE;

exports.CHANS_ANNOUNCE = [ [CHAN_UB_ANNOUNCE, SERV_UB], [CHAN_TYLER_ANNOUNCE, SERV_TYLER] ]; // announcement channels [channelId, guildId]

exports.EMOJI_HALLOFLAME = "342835088670851073"; // emoji used to add a message to hall-of-lame (tylersters)
exports.EMOJI_UPVOTE = "419626452024295452"; // upvote
exports.EMOJI_DOWNVOTE = "419626477496172554"; // downvote
exports.EMOJI_FOOD = "💳"; // food swipe react
exports.EMOJI_DELETE = "❌"; // deletion emoji
exports.EMOJI_STATUSON = "480224750032125962"; // online
exports.EMOJI_STATUSIDLE = "480224750011023360"; // idle
exports.EMOJI_STATUSDND = "480224749654376449"; // do not disturb
exports.EMOJI_STATUSOFF = "480224750065549312"; // offline

CHAN_UB_DELETE_EDIT = "488568153941475328";
CHAN_UB_GENERAL_LOG = "493468802810642463";
exports.CHAN_UB_DELETE_EDIT = CHAN_UB_DELETE_EDIT;
exports.CHAN_UB_GENERAL_LOG = CHAN_UB_GENERAL_LOG;

DELETE_EDIT_CHANNELS = { };
DELETE_EDIT_CHANNELS[SERV_UB] = CHAN_UB_DELETE_EDIT;
exports.DELETE_EDIT_CHANNELS = DELETE_EDIT_CHANNELS;

GENERAL_LOG_CHANNELS = { };
GENERAL_LOG_CHANNELS[SERV_UB] = CHAN_UB_GENERAL_LOG;
exports.GENERAL_LOG_CHANNELS = GENERAL_LOG_CHANNELS;

exports.CATEGORIES = { // Command Categories
    BASIC: {
        name: "Basic",
        shortname: "Basic",
        aliases: [],
        desc: "Basic commands",
        color: "#0000AA",
        cmds: []
	},
	GAMES: {
		name: "Games",
		shortname: "Games",
		aliases: ["botgames"],
		desc: "Bot games for you to play",
		color: "#0000CC",
		cmds: []
	},
    COURSES: {
        name: "Course Info",
        shortname: "Courses",
        aliases: ["seats"],
        desc: "Gives information and provides a watcher for UB course seating",
        color: "#005BBB", // UB Blue
        cmds: []
    },
    INFO: {
        name: "Information",
        shortname: "Info",
        aliases: [],
        desc: "Commands that give the user information",
        color: "#00FF00",
        cmds: []
    },
    MISC: {
        name: "Miscellaneous",
        shortname: "Misc",
        aliases: [],
        desc: "Miscellaneous commands that don't fit elsewhere",
        color: "#666666",
        cmds: []
    },
    STAFF: {
        name: "Staff",
        shortname: "Staff",
        aliases: ["administration", "admin"],
        desc: "Commands to aid administration",
        color: "#FF0000",
        cmds: []
    },
    TEST: {
        name: "Test",
        shortname: "Test",
        aliases: ["debug"],
        desc: "Test commands",
        color: "#000000",
        cmds: []
    },
}

exports.COLORS = { // Colors
	ERROR: "#FF0000",
	DELETE: "#CC0000",
	EDIT: "#F75F1C",
	MEMBER_ADD: "#00AA00",
	MEMBER_LEAVE: "#AA0000",
}