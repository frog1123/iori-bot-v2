import { ActivityType, Client, GatewayIntentBits, Collection } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Config, Command } from './types';
import chalk from 'chalk';
import 'dotenv/config';

export const config: Config = {
  prefix: '.',
  presence: 'idle',
  color: '#ffffff'
};

const __dirname = process.cwd();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

// connect to database
export const prisma = new PrismaClient();
prisma.$connect().then(() => console.log(chalk.bgBlack('connected to database')));

(async () => {
  const commands = new Collection() as Collection<string, Command>;
  const slashCommands = new Collection() as Collection<string, any>;

  const commandFiles = readdirSync(join(__dirname, 'dist', 'commands')).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = (await import(`./commands/${file}`)) as unknown as Command;
    commands.set(command.default.name, command);
  }
  console.log(chalk.bgBlack(`loaded commands from ${commandFiles}`));

  const slashCommandFiles = readdirSync(join(__dirname, 'dist', 'slashcommands')).filter(file => file.endsWith('.js'));
  for (const file of slashCommandFiles) {
    const slashCommand = (await import(`./slashcommands/${file}`)) as unknown as Command;
    slashCommands.set(slashCommand.default.data.name, slashCommand);
  }
  console.log(chalk.bgBlack(`loaded slash commands from ${slashCommandFiles}`));

  // start
  client.on('ready', () => {
    console.log(chalk.bgBlack(`logged in as ${client?.user?.tag}`));
    client?.user?.setPresence({ status: 'idle' });
    client?.user?.setActivity(`${client.guilds.cache.size} server${client.guilds.cache.size > 1 ? 's' : ''}`, { type: ActivityType.Watching });

    let commands = client.application?.commands;

    slashCommands.forEach(sc => {
      commands?.create({ name: sc.default.data.name, description: sc.default.data.description });
    });
  });

  // refresh server watch count
  setInterval(() => client?.user?.setActivity(`${client.guilds.cache.size} server${client.guilds.cache.size > 1 ? 's' : ''}`, { type: ActivityType.Watching }), 300000);
  client.on('messageCreate', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content
      .slice(config.prefix.length)
      .split(' ')
      .filter(arg => arg !== '');
    const command = args!.shift()!.toLowerCase().split(' ')[0];

    // execute command if it exists
    if (typeof commands.get(command) !== 'undefined') commands?.get(command)?.default.execute(message, config, args);
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    // execute slash command if it exists
    if (typeof slashCommands.get(interaction.commandName) !== 'undefined') slashCommands.get(interaction.commandName)?.default.execute(interaction);

    // if (interaction.commandName === 'test') {
    //   interaction.reply('you used a slash command');
    // }
  });

  client.login(process.env.BOT_TOKEN);
})()
  .catch(err => console.error(err))
  .finally(async () => await prisma.$disconnect());
