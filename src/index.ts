import { ActivityType, Client, GatewayIntentBits, Collection } from 'discord.js';
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

(async () => {
  const commands = new Collection() as Collection<string, Command>;
  const commandFiles = readdirSync(join(__dirname, 'dist', 'commands')).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = (await import(`./commands/${file}`)) as unknown as Command;
    commands.set(command.default.name, command);
  }
  console.log(chalk.bgBlack(`loaded commands from ${commandFiles}`));

  // start
  client.on('ready', () => {
    console.log(chalk.bgBlack(`logged in as ${client?.user?.tag}`));
    client?.user?.setPresence({ status: 'idle' });
    client?.user?.setActivity(`${client.guilds.cache.size} server${client.guilds.cache.size > 1 ? 's' : ''}`, { type: ActivityType.Watching });
  });

  // refresh server watch count
  setInterval(() => client?.user?.setActivity(`${client.guilds.cache.size} server${client.guilds.cache.size > 1 ? 's' : ''}`, { type: ActivityType.Watching }), 300000);
  client.on('messageCreate', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).split(/ + /).toString().split(' ');
    const command = args!.shift()!.toLowerCase().split(' ')[0];

    // execute command if it exists
    if (typeof commands.get(command) !== 'undefined') commands?.get(command)?.default.execute(message, config, args);
  });

  client.login(process.env.BOT_TOKEN);
})();
