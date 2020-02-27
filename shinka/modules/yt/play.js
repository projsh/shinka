const ytdl = require('ytdl-core');
const player = require('./player');
const ytapi = require('simple-youtube-api');
const yt = new ytapi(require('../../config.json').ytkey);

module.exports.run = async (bot, msg) => {
    bot.joinVoiceChannel(msg.member.voiceState.channelID).catch(err => {
        console.log(err);
    }).then(async connection => {
        let getMsg = await bot.createMessage(msg.channel.id, 'getting video from youtube...');
        try {
            yt.searchVideos(msg.content.substr(8), 2).then(results => {
                ytdl.getInfo(results[0].url, (err, info) => {
                    if (err) return console.log(err);
                    if (!player.serverQueue[msg.member.guild.id]) {
                        player.serverQueue[msg.member.guild.id] = {
                            queue: []
                        }
                    }
                    player.serverQueue[msg.member.guild.id].queue.push(results[0].url);
                    if (!connection.playing) {
                        player.play(connection, msg, bot);
                        bot.editMessage(msg.channel.id, getMsg.id, `now playing: ${info.title} by ${info.author.name}`);
                    } else {
                        bot.editMessage(msg.channel.id, getMsg.id, `added to queue: ${info.title} by ${info.author.name}`);
                    }
                })
            })
        } catch(err) {
            console.log(err);
        }
    })
}