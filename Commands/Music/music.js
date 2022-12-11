const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
  VoiceChannel,
  GuildEmoji,
} = require("discord.js");
const client = require("../../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Complete music system")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("play")
        .setDescription("Play a song.")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("Provide the name or url you want to play.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("volume")
        .setDescription("Adjust the volume of the song.")
        .addIntegerOption((option) =>
          option
            .setName("percent")
            .setDescription("Min: 1, Max: 99")
            .setMinValue(1)
            .setMaxValue(99)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("options")
        .setDescription("Select an option.")
        .addStringOption((option) =>
          option
            .setName("options")
            .setDescription("Select an option.")
            .setRequired(true)
            .addChoices(
              { name: "queue", value: "queue" },
              { name: "skip", value: "skip" },
              { name: "pause", value: "pause" },
              { name: "resume", value: "resume" },
              { name: "stop", value: "stop" }
            )
        )
    ),
  async execute(interaction) {
    const { options, member, guild, channel } = interaction;

    const subcommand = options.getSubcommand();
    const query = options.getString("query");
    const volume = options.getInteger("percent");
    const option = options.getString("options");
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed
        .setColor("Red")
        .setDescription("You must join the voice channel first.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.voice.channelId === guild.members.me.voice.channelId) {
      embed
        .setColor("Red")
        .setDescription(
          `I'm currently playing at <#${guild.members.me.voice.channelId}>.`
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      switch (subcommand) {
        case "play":
          client.distube.play(voiceChannel, query, {
            textChannel: channel,
            member: member,
          });
          return interaction.reply({ content: "Request received." });

        case "volume":
          client.distube.setVolume(voiceChannel, volume);
          return interaction.reply({
            content: `Volume has been set to ${volume}%.`,
          });

        case "settings":
          const queue = await client.distube.getQueue(voiceChannel);

          if (!queue) {
            embed
              .setColor("Red")
              .setDescription("There isn't any music playing.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }

          switch (option) {
            case "skip":
              await queue.skip(voiceChannel);
              embed
                .setColor("Green")
                .setDescription("Skipped the current song.");
              return interaction.reply({
                embeds: [embed],
                ephemeral: true,
              });
            case "stop":
              await queue.stop(voiceChannel);
              embed
                .setColor("Green")
                .setDescription("Stopped the current song.");
              return interaction.reply({
                embeds: [embed],
                ephemeral: true,
              });
            case "pause":
              await queue.pause(voiceChannel);
              embed
                .setColor("Green")
                .setDescription("Paused the current song.");
              return interaction.reply({
                embeds: [embed],
                ephemeral: true,
              });
            case "resume":
              await queue.resume(voiceChannel);
              embed
                .setColor("Green")
                .setDescription("Resumed the current song.");
              return interaction.reply({
                embeds: [embed],
                ephemeral: true,
              });
            case "queue":
              embed
                .setColor("Purple")
                .setDescription(
                  `${queue.songs.map(
                    (song, id) =>
                      `\n**${id + 1}.** ${song.name} - \`${
                        song.formattedDuration
                      }\``
                  )}`
                );
              return interaction.reply({
                embeds: [embed],
                ephemeral: true,
              });
          }
      }
    } catch (err) {
      console.log(err);

      embed.setColor("Red").setDescription("Something went wrong...");
      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }
  },
};
