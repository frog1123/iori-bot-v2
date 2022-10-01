import { ColorResolvable, Message } from 'discord.js';

export interface Config {
  prefix: string;
  presence: string;
  color: ColorResolvable;
}

export interface Command {
  default: {
    name: string;
    description: string;
    execute: (message: Message, config: Config, args: string[]) => void | Promise<void>;
  };
}
