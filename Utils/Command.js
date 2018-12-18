class Command
{
    /**
     * Creates a Command object
     * @param {string|string[]} name Sets command name (string) or optional name and aliases (string[])
     * @param {string} desc Command description
     * @param {string} usage Usage of command
     * @param {string} category Command category (shortname)
     * @param {Object} options Options for the command
     * @param {boolean} [options.hidden] Whether the command should be hidden from the !command command
     * @param {boolean} [options.delete] Whether the message triggering the command should be deleted
     * @param {Function} func Function to execute on command usage (which takes in the message and its arguments)
     */
    constructor(name, desc, usage, category, options, func)
    {
        this.name = name;
        this.aliases = [];
        if (Array.isArray(name))
        {
            this.name = name[0]; // force name to be string
            this.aliases = name.slice(1); // aliases are everything besides the first
        }
        this.desc = desc;
        this.usage = usage;
        this.category = category;
        this.options = options;
        this.func = func;
    }

    /**
     * Executes a command
     * @param message Message to pass in to the function
     * @param args Message arguments (including command)
     */
    execute(message, args)
    {
        message.channel.startTyping(); // set typing notice
        var cmd = this;
        (async function() { // doesn't actually work -- still tries to stop typing immediately -- no easy fix...
            try {
				cmd.func(message, args);
            }
            catch (e) {
                console.log(e);
                message.channel.send("[Exception] " + e.name + ": " + e.message, {disableEveryone: true, split: true});
            }
        })().then(() => {
                message.channel.stopTyping();
                if (cmd.options.delete)
                    message.delete();
            }
        );
    }
}
module.exports = Command;