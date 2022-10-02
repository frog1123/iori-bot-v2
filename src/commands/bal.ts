import { Message, EmbedBuilder } from 'discord.js';
import { Config } from '../types';
import { prisma } from '../index.js';

export default {
  name: 'bal',
  description: 'view a users balance \n `.bal @user`',
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

    const progressToNextLevel = (user.experience / (user.level * 10)) * 100;
    let progressBar = [...'[----------]'];
    if (progressToNextLevel >= 90) progressBar[10] = '#';
    if (progressToNextLevel >= 80) progressBar[9] = '#';
    if (progressToNextLevel >= 70) progressBar[8] = '#';
    if (progressToNextLevel >= 60) progressBar[7] = '#';
    if (progressToNextLevel >= 50) progressBar[6] = '#';
    if (progressToNextLevel >= 40) progressBar[5] = '#';
    if (progressToNextLevel >= 30) progressBar[4] = '#';
    if (progressToNextLevel >= 20) progressBar[3] = '#';
    if (progressToNextLevel >= 10) progressBar[2] = '#';
    if (progressToNextLevel > 0) progressBar[1] = '#';

    const finalProgressBar = progressBar.join('').replace(/,/g, '');

    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle('balance')
      .setDescription(`balance of <@${userId}>`)
      .addFields({ name: 'balance', value: `${user.balance} 💵` })
      .addFields({ name: 'level', value: `${user.level}` })
      .addFields({ name: `experience · ${user.experience} / ${user.level * 10} (${progressToNextLevel.toFixed(2)}%)`, value: `\`${user.level}\` ${finalProgressBar} \`${user.level + 1}\`` })
      .setFooter({ text: `requested by @${message.author.tag}` })
      .setThumbnail(message.mentions.users.first()?.displayAvatarURL() ?? message.author.displayAvatarURL());

    message.channel.send({ embeds: [embed] });
  }
};
