import { Message, EmbedBuilder } from 'discord.js';
import { Config } from '../types';
import { prisma } from '../index.js';

export default {
  name: 'bal',
  description: 'view a users balance',
  execute: async (message: Message, config: Config) => {
    const userId = message.mentions.users.first()?.id ?? message.author.id;

    const user = await prisma.user.findUnique({
      where: {
        discordId: userId
      }
    });

    if (!user) {
      message.channel.send('user has not registered');
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle('balance')
      .setDescription(`balance of <@${userId}>`)
      .addFields({ name: 'balance', value: `${user.balance} 💵` })
      .addFields({ name: 'requested by', value: `<@${message.author.id}>` })
      .setThumbnail(message.mentions.users.first()?.displayAvatarURL() ?? message.author.displayAvatarURL());

    message.channel.send({ embeds: [embed] });
  }
};
