import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('test2').setDescription('test2'),
  execute: async (interaction: any) => {
    await interaction.reply('you used a slash command');
  }
};
