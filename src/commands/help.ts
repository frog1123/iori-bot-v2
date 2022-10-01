import { Message, EmbedBuilder } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Command, Config } from '../types';

export default {
  name: 'help',
  description: 'lists commands and other info',
  execute: async (message: Message, config: Config) => {
    const embed = new EmbedBuilder().setColor(config.color).setTitle('Commands:').setDescription(`my prefix is \`${'.'}\``);

    const commandFiles = readdirSync(join(process.cwd(), 'dist', 'commands')).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = (await import(`./${file}`)) as unknown as Command;
      embed.addFields({ name: `${command.default.name}`, value: `${command.default.description}` });
    }

    message.channel.send({ embeds: [embed] });
  }
};
