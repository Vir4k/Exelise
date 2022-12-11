const { EmbedBuilder } = require("@discordjs/builders");
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActivityType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Update the bot presences.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("activity")
        .setDescription("Update the bot activity")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Pick an activity")
            .setRequired(true)
            .addChoices(
              { name: "Playing", value: "Playing" },
              { name: "Listening", value: "Listening" },
              { name: "Watching", value: "Watching" },
              { name: "Streaming", value: "Streaming" },
              { name: "Competing", value: "Competing" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("activity")
            .setDescription("Set the current activity.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("status")
        .setDescription("Update the bot status")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Pick a status")
            .setRequired(true)
            .addChoices(
              { name: "Online", value: "Online" },
              { name: "Idle", value: "Idle" },
              { name: "Do not Disturb", value: "Do not Disturb" },
              { name: "Invisible", value: "invisible" }
            )
        )
    ),
  async execute(interaction, client) {
    const { options } = interaction;

    const sub = options.getSubcommand(["activity", "status"]);
    const type = options.getString("type");
    const activity = options.getString("activity");

    try {
      switch (sub) {
        case "activity":
          switch (type) {
            case "Playing":
              client.user.setActivity(activity, {
                type: ActivityType.Playing,
              });
              break;
            case "Watching":
              client.user.setActivity(activity, {
                type: ActivityType.Watching,
              });
              break;
            case "Listening":
              client.user.setActivity(activity, {
                type: ActivityType.Listening,
              });
              break;
            case "Competing":
              client.user.setActivity(activity, {
                type: ActivityType.Competing,
              });
              break;
            case "Streaming":
              client.user.setActivity(activity, {
                type: ActivityType.Streaming,
              });
              break;
          }
        case "status":
          client.user.setPresence({ status: type });
          break;
      }
    } catch (err) {
      console.log(err);
    }

    const embed = new EmbedBuilder();

    return interaction.reply({
      embeds: [
        embed.setDescription(
          `Successfully updated your ${sub} to **${type}**.`
        ),
      ],
    });
  },
};
