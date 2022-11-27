const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const logs = require("discord-logs");

const { handleLogs } = require("./Handlers/Logs");
const { loadEvents } = require("./Handlers/Event");
const { loadCommands } = require("./Handlers/Command");

const client = new Client({
  intents: [Object.keys(GatewayIntentBits)],
  partials: [Object.keys(Partials)],
});

logs(client, {
  debug: true,
});

client.commands = new Collection();
client.config = require("./config.json");

client.login(client.config.token).then(() => {
  handleLogs(client);
  loadEvents(client);
  loadCommands(client);
});
