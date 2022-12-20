module.exports = {
    name: "messageCreate",

    async execute(message) {

        //Log that it happened
        // console.log("messageCreate event fired");

        //Call for helpers file (smooch DarlCat for this)
        const helper = require("../helpers/discord-anti-spam");

        //Check for antispam
        helper.antiSpam.message(message);
    }
};
