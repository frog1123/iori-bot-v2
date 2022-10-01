import { Message, EmbedBuilder } from 'discord.js';
import { Config } from '../types';
import { prisma } from '../index.js';
import { formatTime } from '../utils/formatTime.js';
import { levelUp } from '../utils/levelUp.js';

export default {
  name: 'daily',
  description: 'claim daily award',
  execute: async (message: Message, config: Config) => {
    const amount = 50;

    const user = await prisma.user.findUnique({
      where: {
        discordId: message.author.id
      }
    });

    if (!user) {
      message.channel.send('user has not registered');
      return;
    }

    if (new Date().valueOf() - user.lastDailyTime.valueOf() <= 24 * 60 * 60 * 1000) {
      message.channel.send(`this command is on cooldown, please wait \`${formatTime(24 * 60 * 60 * 1000 - (new Date().valueOf() - user.lastDailyTime.valueOf()))}\``);
      return;
    }

    await prisma.user.update({
      where: {
        discordId: message.author.id
      },
      data: {
        balance: user.balance + amount,
        experience: user.experience + 5,
        lastDailyTime: new Date()
      }
    });

    const embed = new EmbedBuilder().setColor(config.color).setTitle('success').setDescription(`claimed ${amount} 💵`);
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
