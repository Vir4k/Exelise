const { ActionRowBuilder } = require("@discordjs/builders");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const suggestionSchema = require("../../Models/Suggestion");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Place a suggestion.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Please select an option.")
        .setRequired(true)
        .addChoices(
          { name: "Discord", value: "Discord" },
          { name: "Command", value: "Command" },
          { name: "Other", value: "Other" },
          { name: "Server", value: "Server" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Describe your suggestion.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { guild, guildId, options, member, user } = interaction;

    const type = options.getString("type");
    const description = options.getString("description");

    const channel = guild.channels.cache.get("1044571797523279903");

    const embed = new EmbedBuilder()
      .setColor("Orange")
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        { name: "Suggestion", value: description, inline: false },
        { name: "Type", value: type, inline: true },
        { name: "Status", value: "Pending", inline: true }
      )
      .setTimestamp(new Date());

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("suggest-accept")
        .setLabel("Accept")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("suggest-decline")
        .setLabel("Decline")
        .setStyle(ButtonStyle.Danger)
    );

    try {
      const m = await channel.send({
        embeds: [embed],
        components: [buttons],
        fetchReply: true,
      });
      await channel.send({
        content: "Use `/suggest` to submit your suggestion.",
      });
      await interaction.reply({
        content: "Your suggestion was successfully sent.",
        ephemeral: true,
      });
      await suggestionSchema.create({
        GuildID: guildId,
        MessageID: m.id,
        Details: [
          {
            MemberID: member.id,
            Type: type,
            Suggestion: description,
          },
        ],
      });
    } catch (err) {
      console.log(err);
    }
  },
};
