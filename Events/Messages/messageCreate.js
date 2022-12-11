const { EmbedBuilder } = require("discord.js");
const Levels = require("discord.js-leveling");

module.exports = {
  name: "messageCreate",

  async execute(message) {
    if (!message.guild || message.author.bot) return;

    if (message.content.length < 3) return;

    const randomAmountOfXp = Math.floor(Math.random() * 29) + 1;
    const hasLeveledUp = await Levels.appendXp(
      message.author.id,
      message.guild.id,
      randomAmountOfXp
    );

    if (hasLeveledUp) {
      const user = await Levels.fetch(message.author.id, message.guild.id);

      const levelEmbed = new EmbedBuilder()
        .setTitle("Level Up!")
        .setDescription(
          `${message.author}, you just leveled up to level **${
            user.level + 1
          }**`
        )
        .setColor("Green")
        .setTimestamp(new Date());

      const sendEmbed = await message.channel.send({ embeds: [levelEmbed] });
      sendEmbed.react("🎉");
    }
  },
};
