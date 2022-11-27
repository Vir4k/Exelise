const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get the ping of Exelise"),
  execute(interaction, client) {
    let status = {
      green: "<:stable:1040844941485686785>",
      yellow: "<:unstable:1040844983802019930>",
      red: "<:lag:1040844734966538311>",
    };

    let bot = new Date() - interaction.createdAt;
    let api = client.ws.ping;

    client.application.fetch();

    interaction.reply({
      content: `**Bot Latency:** ${
        bot <= 200 ? status.green : bot <= 400 ? status.yellow : status.red
      } \`${bot}ms\`\n**API Latency:** ${
        api <= 200 ? status.green : api <= 400 ? status.yellow : status.red
      } \`${api}ms\``,
    });
  },
};
