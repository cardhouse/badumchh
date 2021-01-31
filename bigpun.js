const tmi = require('tmi.js');
require('dotenv').config();
const axios = require('axios').default;
const cheerio = require('cheerio');

const client = new tmi.Client({
	options: { debug: true },
	connection: { reconnect: true },
	identity: {
		username: 'big_pun',
		password: process.env.BOT_TOKEN
	},
	channels: [
        'cardhouse_',
        'JSciBeats',
        'krackentoast'
    ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;

	if(message.toLowerCase() === '!bigpun') {
        axios.get('https://icanhazdadjoke.com/')
        .then(function (response) {
            const $ = cheerio.load(response.data);
            client.say(channel, $('.section .container .content .card .card-content .subtitle').text());
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
	}
});