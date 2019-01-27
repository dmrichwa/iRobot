const { got } = require("../Utils/");

// I don't dabble in javascript much please forgive me

function cleanup(code){
    return (code.startsWith("```") && code.endsWith("```") ? code.split('\n').slice(1, -1).join("\n") : code.replace(/`/g,"").trim())
}

exports.run = async (client, msg, args) => {
    msg.channel.startTyping();
    var code = msg.content.split('\n').splice(1).join('\n');
    var opts = {'body':JSON.stringify({"cmd":"lua main.cpp","src": cleanup(code)})};
    var response = await got.post('http://coliru.stacked-crooked.com/compile', opts);
    if (response.statusCode != 200) {
        msg.channel.send("Error Timed Out");
    }
    else {
        var out = response.body;
        if(out.length < 1700){
            msg.channel.send("```" + `lua\n${out.trim()}` + "\n```");
        }
        else{
            msg.channel.send("Output too long to be displayed");
        }
    }
    msg.channel.stopTyping();
};

exports.help = {
    name:"lua",
    aliases: [],
    category: "Miscellaneous",
    description: "Evaluates lua code",
    usage: "lua ```lua [Lua Code]```",
};