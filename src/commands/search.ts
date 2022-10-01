import { Message, EmbedBuilder } from 'discord.js';
import { Config } from '../types';
import { prisma } from '../index.js';
import { randomNumBetween } from '../utils/random.js';
import { formatTime } from '../utils/formatTime.js';
import { levelUp } from '../utils/levelUp.js';

export default {
  name: 'search',
  description: 'search for items',
  execute: async (message: Message, config: Config) => {
    const amount = randomNumBetween(1, 10);

    const user = await prisma.user.findUnique({
      where: {
        discordId: message.author.id
      }
    });

    if (!user) {
      message.channel.send('user has not registered');
      return;
    }
    if (new Date().valueOf() - user.lastSearchTime.valueOf() <= 5 * 1000) {
      message.channel.send(`this command is on cooldown, please wait \`${formatTime(5 * 1000 - (new Date().valueOf() - user.lastSearchTime.valueOf()))}\``);
      return;
    }

    await prisma.user.update({
      where: {
        discordId: message.author.id
      },
      data: {
        balance: user.balance + amount,
        experience: user.experience + 1,
        lastSearchTime: new Date()
      }
    });

    const embed = new EmbedBuilder().setColor(config.color).setTitle('success').setDescription(`you searched and found ${amount} 💵`);
    message.channel.send({ embeds: [embed] });

    const afterUser = await prisma.user.findUnique({
      where: {
        discordId: message.author.id
      }
    });

    if (!afterUser) return;
    if (afterUser.experience >= afterUser.level * 10) levelUp(message, message.author.id, config);
  }
};
