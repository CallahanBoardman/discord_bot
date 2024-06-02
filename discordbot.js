const {
  clientId,
  guildId,
  token
} = require('./config.json');
const {
  join
} = require('node:path');
const {
  readdirSync
} = require('node:fs');
const {
  createCanvas,
  loadImage
} = require('@napi-rs/canvas');
const {
  GlobalFonts
} = require('@napi-rs/canvas');
const {
  RecurrenceRule,
  Range,
  scheduleJob
} = require('node-schedule');
const {
  globalrepo
} = require('./global-repo');
const {
  request
} = require('undici');
const {
  AttachmentBuilder,
  Client,
  Collection,
  Events,
  GatewayIntentBits
} = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
client.on('ready', () => { console.log(`Logged in as ${client.user.tag}!`); });
client.commands = new Collection();
const foldersPath = join(__dirname, 'commands');
const commandFolders = readdirSync(foldersPath);
for (const folder of commandFolders) {
  const commandsPath = join(foldersPath, folder);
  const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}
client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      });
    }
  }
});
client.login(token);
client.on('messageCreate', async msg => {
  // You can view the msg object here with console.log(msg)
  if (msg.content === 'Hello') {
    const canvas = createCanvas(600, 800);
    const context = canvas.getContext('2d');
    const background = await loadImage(`./assets/Front.png`);
    // Select the font size and type from one of the natively available fonts
    context.font = '100px Comic Sans MS';

    // Select the style that will be used to fill the text in
    context.fillStyle = '#ffffff';
    context.fillText('Fuck', 100, 100);
    // This uses the canvas dimensions to stretch the image onto the entire canvas
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Use the helpful Attachment class structure to process the file for you
    const attachment = new AttachmentBuilder(await canvas.encode('png'), {
      name: 'profile-image.png'
    });
    msg.reply({
      files: [attachment]
    });
  }
});
const schedule_rule = new RecurrenceRule();
schedule_rule.minute = new Range(0, 59, 1);
scheduleJob(schedule_rule, async () => {
  let reminderMap = globalrepo.reminderMap;
  let remindersToDelete = [];
  for (const [id, reminder] of reminderMap) {
    let reminderDate = new Date(reminder.ReminderDate);
    let reminderTime = reminderDate.getTime();
    if (reminderTime <= Date.now()) {
      for (const userID of reminder.UsersList) {
        const user = await client.users.fetch(userID).catch(e => console.log(e));
        if (!user) {
          console.error('Invalid user');
          continue;
        }
        await user.send(reminder.ReminderMessage).catch(() => {
          console.error("User has DMs closed or has no mutual servers with the bot:(");
        });
      }
      remindersToDelete.push(id);
    }
  }
  globalrepo.removeFromList(remindersToDelete);
});