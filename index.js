'use strict';

const token = process.env.TELEGRAM_TOKEN;
const port = process.env.PORT || 443;
const host = process.env.HOST;

const url = `https://${process.env.HEROKU_NAME}.herokuapp.com/bot${token}/`;
const TeleBot = require('telebot');
const fetch = require('node-fetch');
const axios = require('axios');
const baseUrl = `https://api.telegram.org/bot${token}/`;

let bot;
if (process.env.NPM_CONFIG_PRODUCTION) {
    console.log('----Production----')
    bot = new TeleBot({
        token,
        usePlugins,
        // pluginConfig,
        webHook: { port: port, host: host }
    });
} else {
    console.log('----non-Production----')
    bot = new TeleBot({
        token,
        usePlugins,
        // pluginConfig,
        polling: true
    });
}
bot.getMe().then(function(me) {
    const botsName = me.username;
    console.log('---\nHello! My name is %s!', me.first_name);
    console.log(`And my username is @${ botsName }\n---`);
    return botsName;
});
bot.on("error", err => {
    return axios.post(baseUrl + "sendMessage", {
            chat_id: -175561520, //chatID of error channel
            text: "Tzadikim Project - Telegram Error " + err.error.error_code + "\nDescription: " + err.error.description + "\nfull report " + JSON.stringify(err),
            notification: false
        }).then(response => {
            return console.log('--------Telegram Error sent to error channel--------')
        })
        .catch(err => {
            try { bot.sendMessage(-175561520, JSON.stringify(err)) } catch (e) { console.log('Error from error sender after trying to send to telegram via boot sendMessage: ', JSON.stringify(e)) }
            return console.log('Error from error sender: ', JSON.stringify(err))
        })
});
process.on('unhandledRejection', (p) => {
    console.log('Unhandled Rejection at770: ' + JSON.stringify(p));
    // console.log('Unhandled Rejection at770: ' + p);
});
bot.on('*', (msg, self) => {
    // && self.type == 'command'
    if (msg.chat.id == msg.from.id) {
        return commands.commandsFunc(msg, self, bot);
    } else if (-264522548 == msg.chat.id && msg.reply_to_message != undefined) {
        msgForwarder.reply(msg, bot)
    }
    // else {
    //     bot.sendMessage(msg.chat.id, "message not recognized, try /help, or send me a message by /feedback")
    // }
});

// Call API
bot.start();