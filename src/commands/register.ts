import { Message, EmbedBuilder } from 'discord.js';
import { Config } from '../types';
import { prisma } from '../index.js';

export default {
  name: 'register',
  description: 'register to the economy system',
  execute: async (message: Message, config: Config) => {
    const embed = new EmbedBuilder().setColor(config.color).setTitle('success').setDescription(`registered <@${message.author.id}>`).addFields({ name: 'user id', value: message.author.id }).addFields({ name: 'default balance', value: '100 💵' });

    const user = await prisma.user.findUnique({
      where: {
        discordId: message.author.id
      }
    });
    if (user) {
      message.channel.send('you have already registered');
      return;
    }

    await prisma.user
      .create({
        data: {
          discordId: message.author.id
        }
      })
      .then(() => {
        message.channel.send({ embeds: [embed] });
      })
      .catch(() => {
        message.channel.send('error: something went wrong');
      });
  }
};
