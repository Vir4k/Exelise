const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { suggestionSchema } = require("../../Models/Suggestion");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const { member, guildId, customId, message } = interaction;

    if (!interaction.isButton()) return;
    if (customId == "suggest-accept" || customId == "suggest-decline") {
      if (!member.permissions.has(PermissionFlagsBits.Administrator))
        return interaction.reply({
          content: "You're missing the permission.",
          ephemeral: true,
        });
      suggestionSchema.findOne(
        { GuildID: guildId, MessageID: message.id },
        async (err, data) => {
          if (err) throw err;

          if (!data)
            return interaction.reply({
              content: "No data found.",
              ephemeral: true,
            });

          const embed = message.embeds[0];

          if (!embed)
            return interaction.reply({
              content: "No embed found.",
              ephemeral: true,
            });

          switch (customId) {
            case "suggest-accept":
              embed.data.fields[2] = {
                name: "Status",
                value: "Accepted",
                inline: true,
              };
              const acceptedEmbed = EmbedBuilder.from(embed).setColor("Green");

              message.edit({ embeds: [acceptedEmbed] });
              interaction.reply({
                content: "Accepted the suggestion.",
                ephemeral: true,
              });
              break;

            case "suggest-decline":
              embed.data.fields[2] = {
                name: "Status",
                value: "Declined",
                inline: true,
              };
              const declinedEmbed = EmbedBuilder.from(embed).setColor("Red");

              message.edit({ embeds: [declinedEmbed] });
              interaction.reply({
                content: "Declined the suggestion.",
                ephemeral: true,
              });
              break;
          }
        }
      );
    }
  },
};
