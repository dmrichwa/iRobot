const Util = require('./util.js');
const dateFormat = require("dateformat");
dateFormat.masks.SHORTTIMEDATEREV = "h:MM TT Z 'on' ddd, mmm d, \'yy";
dateFormat.masks.SHORTTIMEDATE = "ddd, mmm d, \'yy \"at\" h:MM TT Z";
dateFormat.masks.MEDTIMEDATE = "ddd, mmm d, yyyy 'at' h:MM TT Z";
dateFormat.masks.LONGTIMEDATE = "dddd, mmmm d, yyyy 'at' h:MM TT Z";
dateFormat.masks.FILE = "yyyy-mm-dd HH:MM:ss";

module.exports = {
	Discord: require("discord.js"),
	sql: require("sqlite"),
	sqlite3: require("sqlite3"),
	fs: require("fs"),
	LastFmNode: require("lastfm").LastFmNode,
	average: require("fast-average-color-node"),
	got: require("got"),
	dateFormat: dateFormat,
	loadJsonFile: require("load-json-file"),
	writeJsonFile: require("write-json-file"),

	find_category: Util.find_category,
	find_command: Util.find_command,
	user_form: Util.user_form,
	embedify: Util.embedify,
	invalid_usage: Util.invalid_usage,
	command_info: Util.command_info,
	add_command: Util.add_command,
	count_commands: Util.count_commands,
	get_role_array: Util.get_role_array,
	has_permission: Util.has_permission,
	get_color_from_URL: Util.get_color_from_URL,
	rainbow: Util.rainbow,
	get_user: Util.get_user,
	get_member: Util.get_member,
	get_role: Util.get_role,
	get_channel: Util.get_channel,
	pluralize: Util.pluralize,
	format_role: Util.format_role,
	boolean_to_yesno: Util.boolean_to_yesno,
}