const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const YoutubePoster = require("discord-youtube");
const logs = require("discord-logs");

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

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

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()],
});

client.ytd = new YoutubePoster(client, {
  loop_delay_in_min: 1,
});

client.commands = new Collection();
client.config = require("./config.json");

module.exports = client;

client.login(client.config.token).then(() => {
  handleLogs(client);
  loadEvents(client);
  loadCommands(client);
});
