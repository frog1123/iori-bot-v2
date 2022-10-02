import { Message, EmbedBuilder } from 'discord.js';
import { Config } from '../types';
import { prisma } from '../index.js';
import { isNumber } from '../utils/isNumber.js';

export default {
  name: 'transfer',
  description: 'transfer money to another user',
  execute: async (message: Message, config: Config, args: string[]) => {
    const mentionedUser = message.mentions.users.first();
    const userToTransferFrom = await prisma.user.findUnique({
      where: {
        discordId: message.author.id
      }
    });

    if (!userToTransferFrom) {
      message.channel.send('you are not registered');
      return;
    }

    if (!mentionedUser) {
      message.channel.send('no user specified');
      return;
    }

    if (mentionedUser.bot) {
      message.channel.send('cannot transfer to a bot');
      return;
    }

    const userToTransferTo = await prisma.user.findUnique({
      where: {
        discordId: mentionedUser.id
      }
    });

    if (!userToTransferTo) {
      message.channel.send('user specified has not registered');
      return;
    }

    if (typeof args[1] === 'undefined') {
      message.channel.send('there was an error');
      return;
    }

    if (!isNumber(args[1], true)) {
      message.channel.send('incorrect transfer value');
      return;
    }

    if (parseInt(args[1]) > userToTransferFrom.balance) {
      message.channel.send('you cannot transfer this much');
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle('success')
      .setDescription(`transferred ${args[1]} 💵 to <@${mentionedUser.id}>`)
      .addFields({ name: 'transferred from', value: `<@${message.author.id}>` });

    await prisma.user
      .update({
        where: {
          discordId: message.author.id
        },
        data: {
          balance: userToTransferFrom.balance - parseInt(args[1])
        }
      })
      .then(async () => {
        await prisma.user.update({
          where: {
            discordId: mentionedUser.id
          },
          data: {
            balance: userToTransferTo.balance + parseInt(args[1])
          }
        });
      })
      .then(() => {
        message.channel.send({ embeds: [embed] });
      });
  }
};
