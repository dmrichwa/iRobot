const { sql, embedify, invalid_usage, get_role_array, has_permission, get_role, pluralize, format_role } = require("../Utils/");
const { ROLE_UB_UNASS, CATEGORIES, COLORS } = require("../Utils/constants.js");

exports.run = async (client, msg, args) => {
	if (args.length === 1) {
		return msg.channel.send({ embed: invalid_usage(this) });
	}
	var embed;
	sql.open("./Objects/" + msg.guild.id + "_roles.sqlite").then(() => {
		(async () => {
			const roleList = args.slice(2).join(" ").split("\\"); // get every role and perform operations
			var convertedRoleList = [];
			var badRoleList = []; // error messages for roles that could not be found
			for (var inRole of roleList) {
				await new Promise(next => {
					get_role(inRole, msg.guild).then(role => {
						convertedRoleList.push(role);
						next();
					}).catch(error => {
						badRoleList.push(error.message);
						next();
					});
				});
			}
			if (args[1].toLowerCase() === "add") {// add these role(s) to the list of assignable roles
				if (!has_permission(["BAN_MEMBERS"], msg.member)) {
					embed = embedify("", COLORS.ERROR,
					[
						["Error", "You must have the Ban Members permission to add to the selfrole list\n(If you are trying to add a role, do not use the \"add\" keyword)"]
					]);
					selfrole_finally();
				}
				else if (convertedRoleList.length === 0 && badRoleList.length === 0) {
					embed = embedify("", COLORS.ERROR,
					[
						["Error", "No roles found"]
					]);
					selfrole_finally();
				}
				else {
					var str = "";
					for (var role of convertedRoleList) {
						await new Promise(next => {
							sql.get(`SELECT * FROM selfroles WHERE roleId ="${role.id}"`).then(row => {
								if (!row) {
									sql.run("INSERT INTO selfroles (roleId, v) VALUES (?, ?)", [role.id, 1]).then(() => {
										str += "Role " + format_role(role, false, true) + " added to selfrole list\n";
										next();
									});
								}
								else {  // role ID already exists in table
									str += "~~Role " + format_role(role, false, true) + " already in selfrole list~~\n";
									next();
								}
							}).catch(error => {
								console.log(error);
								sql.run("CREATE TABLE IF NOT EXISTS selfroles (roleId TEXT, v INTEGER)").then(() => {
									sql.run("INSERT INTO selfroles (roleId, v) VALUES (?, ?)", [role.id, 1]).then(() => {
										str += "Role '**" + role.name + "**' added to selfrole list\n";
										next();
									});
								});
							});
						});
					}
					for (var role of badRoleList) {
						str += "_" + role + "_\n";
					}
					embed = embedify("", CATEGORIES.MISC.color,
					[
						["Success", str]
					]);
					selfrole_finally();
				}
			}
			else if (args[1].toLowerCase() === "remove") { // remove thse role(s) from the list of assignable roles
				if (!has_permission(["BAN_MEMBERS"], msg.member)) {
					embed = embedify("", COLORS.ERROR,
					[
						["Error", "You must have the Ban Members permission to remove from the selfrole list"]
					]);
					selfrole_finally();
				}
				else if (convertedRoleList.length === 0 && badRoleList.length === 0) {
					embed = embedify("", COLORS.ERROR,
					[
						["Error", "No roles found"]
					]);
					selfrole_finally();
				}
				else {
					var str = "";
					for (var role of convertedRoleList) {
						await new Promise(next => {
							sql.get(`SELECT * FROM selfroles WHERE roleId ="${role.id}"`).then(row => {
								if (!row) { // role not in table
									str += "~~Role " + format_role(role, false, true) + " not in selfrole list~~\n";
									next();
								}
								else { // role ID already exists in table
									sql.run(`DELETE FROM selfroles WHERE roleId = "${role.id}"`).then(() => {
										str += "Role " + format_role(role, false, true) + " removed from selfrole list\n";
										next();
									});
								}
							}).catch(() => {
								console.error;
							});
						});
					}
					for (var role of badRoleList) {
						str += "_" + role + "_\n";
					}
					embed = embedify("", CATEGORIES.MISC.color,
					[
						["Success", str]
					]);
					selfrole_finally();
				}
			}
			else if (args[1].toLowerCase() === "list") { // list the assignable roles
				var roles = [];
				var staleRoles = []; // deleted roles that should be removed from the table
				sql.all(`SELECT * FROM selfroles`).then(rows => {
					(async () => {
						for (var row of rows) {
							await new Promise(next => {
								get_role(row.roleId, msg.guild).then(role => {
									roles.push(role);
									next();
								}).catch(error => {
									console.log("Role no longer exists: " + row.roleId);
									staleRoles.push(row.roleId);
									next();
								})
							});
						}
						roles.sort((a, b) => {
							if (a.name.toLowerCase() < b.name.toLowerCase())
								return -1;
							else if (b.name.toLowerCase() < a.name.toLowerCase())
								return 1;
							else
								return 0;
						});
						var str = "";
						for (var role of roles) {
							str += format_role(role, args.length >= 3 && args[2].toLowerCase() === "id", true) + "\n";
						}
						if (str === "") {
							str = "None";
						}
						embed = embedify("", CATEGORIES.MISC.color,
						[
							["All Selfroles", str, true]
						], "", "", roles.length + " " + pluralize("selfrole", "selfroles", roles.length), "", "", "", "");
						sql.run(`DELETE FROM selfroles WHERE roleId IN (` + staleRoles.join(",") + `)`).then(() => {
							if (staleRoles.length > 0) {
								console.log("Roles deleted: " + staleRoles.join(", "));
							}
							selfrole_finally();
						});
					})();
				});
			}
			else if (args[1].toLowerCase() === "unlist") { // list the unassignable roles
				sql.all(`SELECT * FROM selfroles`).then(rows => {
					(async () => {
						var rolesAssign = [];
						var roles = [];
						for (var row of rows) {
							await new Promise(next => {
								get_role(row.roleId, msg.guild).then(role => {
									rolesAssign.push(role);
									next();
								}).catch(error => {
									console.log("Role no longer exists: " + row.roleId);
									next();
								})
							});
						}
						for (var role of get_role_array(msg.guild)) { // build array of roles not found in selfrole list
							if (!rolesAssign.includes(role)) {
								roles.push(role);
							}
						}
						var str = "";
						for (var role of roles) {
							str += format_role(role, args.length >= 3 && args[2].toLowerCase() === "id", true) + "\n";
						}
						if (str === "") {
							str = "None";
						}
						embed = embedify("", CATEGORIES.MISC.color,
						[
							["All Non-Selfroles", str, true]
						], "", "", roles.length + " non-" + pluralize("selfrole", "selfroles", roles.length), "", "", "", "");
						selfrole_finally();
					})();
				});
			}
			else { // add/remove the role from the current user
				get_role(args.slice(1).join(" "), msg.guild).then(role => {
					var found = false;
					sql.get(`SELECT * FROM selfroles WHERE roleId ="${role.id}"`).then(row => {
						if (!row) { // role is not a selfrole
							found = false;
						}
						else { // role is a selfrole
							found = true;
						}
						if (!found) { // role is not a selfrole
							embed = embedify("", COLORS.ERROR,
							[
								["Error", "Role is not self-assignable"]
							]);
							selfrole_finally();
						}
						else {
							if (msg.member.roles.has(role.id)) { // user has role, so remove
								msg.member.removeRole(role);
								embed = embedify("", CATEGORIES.MISC.color,
								[
									["Success", "Role " + format_role(role, false, true) + " removed"]
								]);
								selfrole_finally();
							}
							else { // user does not have role, so add
								msg.member.addRole(role);
								if (msg.member.roles.has(ROLE_UB_UNASS)) { // remove unassigned role when they add a role
									msg.member.removeRole(ROLE_UB_UNASS);
								}
								embed = embedify("", CATEGORIES.MISC.color,
								[
									["Success", "Role " + format_role(role, false, true) + " added"]
								]);
								selfrole_finally();
							}
						}
					}).catch(error => {
						console.log(error);
					});
				}).catch(error => {
					msg.channel.send("Error: " + error.message);
				})
			}
		})();
		function selfrole_finally() {
			sql.close();
			msg.channel.send({ embed: embed });
		}
	});
};

exports.config = {
	delete: false,
	hidden: false,
};

exports.help = {
	name: "role",
	aliases: ["selfrole", "sr"],
	category: "Miscellaneous",
	description: "Adds or removes a selfrole",
	usage: "role (add/remove/list) (role name(s) separated by backslashes)"
};