import { EmbedBuilder, Message } from 'discord.js';
import { Config } from '../types';
import { prisma } from '../index.js';

export const levelUp = async (message: Message, id: string, config: Config) => {
  const user = await prisma.user.findUnique({
    where: {
      discordId: id
    }
  });

  if (!user) return;

  await prisma.user.update({
    where: {
      discordId: id
    },
    data: {
      level: user?.level + 1,
      experience: 0
    }
  });

  const embed = new EmbedBuilder()
    .setColor(config.color)
    .setTitle('level up')
    .setDescription(`🎉 you leveled up from ${user.level - 1} ➡️ ${user.level}`);
  message.channel.send({ embeds: [embed] });
};
