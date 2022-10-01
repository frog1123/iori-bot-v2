import { Message } from 'discord.js';
import { formatTime } from '../utils/formatTime.js';

export default {
  name: 'ping',
  description: 'check if i am online',
  execute: (message: Message) => {
    message.channel.send('pinging...').then(msg => {
      const ping = msg.createdTimestamp - message.createdTimestamp;
      msg.edit(`pong! took \`${formatTime(ping, 'presicion')}\``);
    });
  }
};
