const tmi = require('tmi.js');
require('dotenv').config();
const axios = require('axios').default;
const cheerio = require('cheerio');
const base = "https://www.timeanddate.com";

// makeCall();
const channels = [
	'cardhouse_',
	'jscibeats',
	'krackentoast'
];

const client = new tmi.Client({
	options: { debug: true },
	connection: { reconnect: true },
	identity: {
		username: 'CarmenSativago',
		password: 'oauth:6cybqysybb0n2kwq1hn6l126ydja68'
	},
	channels: channels
});

client.connect();

client.on("connected", (address, port) => {
	setInterval(makeCall, 10000);
});

function makeCall() {
	const d = new Date;
	if (d.getMinutes() == 20 && d.getSeconds() < 10) {
		axios.get(`${base}/worldclock/?sort=2`)
			.then(function (response) {
				const $ = cheerio.load(response.data);
				const result = $('.zebra tbody tr').children('td')
					.filter((i, el) => {
						// Only keep nodes where it is 4:20
						const parts = $(el).next().text().split(':');
						return (
							(parts[0].substr(-1, 1) == 4)
							&& (parts[1].substr(0,2) == 20)
						);
					})
					.map((i, el) => {
						return $(el).find('a').attr('href');
					})
					.get();
				// Grab a random city where it is 4:20, and ping the room
				const city = result[Math.floor(Math.random() * result.length)];

				return axios.get(base + city);
			})
			.then(response => {
				const $ = cheerio.load(response.data);
				const location = $('.headline-banner__title').text()
					.split('in ').pop();
					// const country = $('.bk-focus__info tbody td').first().text();
					// const state = $('.bk-focus__info tbody tr:nth(1)').text();
				const time = $('#ct').text();
				console.log(location, time);

				channels.forEach(channel => {
					client.say(channel, `/me has been spotted sparking up a bluntson burner somewhere near ${location}. Local time: ${time}`);
				})
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});
	}
}






// const tmi = require('tmi.js');
// require('dotenv').config();
// const axios = require('axios').default;
// const cheerio = require('cheerio');

// const client = new tmi.Client({
// 	options: { debug: true },
// 	connection: { reconnect: true },
// 	identity: {
// 		username: 'CarmenSativago',
// 		password: process.env.BOT_TOKEN
// 	},
// 	channels: ['cardhouse_']
// });

// client.connect();
// // sleep(10000);
// function sleep(milliseconds) {
// 	const date = Date.now();
// 	let currentDate = null;
// 	do {
// 		currentDate = Date.now();
// 	} while (currentDate - date < milliseconds);
// }

// client.on("connected", (address, port) => {
// 	start();
// });

// async function start() {

// 	while (true) {
// 		const d = new Date;
// 		console.log(d.getMinutes());
// 		if (true) {
// 		// if(d.getMinutes() == 20) {
// 			console.log("We should be getting something");
// 			axios.get('https://www.timeanddate.com/worldclock/?sort=2')
// 				.then(function (response) {
// 					console.log("We got a response");
// 					const $ = cheerio.load(response.data);

// 					let result = $('.zebra tbody tr').children('td').filter((i, el) => {
// 						let string = $(el).next().text();
// 						const parts = string.split(':');

// 						return (parts[0].substr(-1, 1) == 4);
// 					})
// 						.text().replace(/\*/g, '').trim().split(' ');

// 					const city = result[Math.floor(Math.random() * result.length)];
// 					console.log(city);
// 					client.say(channel, "It's time to celebrate 4:20 in " + city);
// 				})
// 				.catch(function (error) {
// 					// handle error
// 					console.log(error);
// 				})
// 				.then(function () {
// 					// always executed
// 				});
// 		}
// 		console.log('checked');
// 		// sleep(10000);
// 	}
// }
