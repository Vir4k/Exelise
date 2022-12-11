const { Client, ActivityType } = require("discord.js");
const { connect } = require("mongoose");
const config = require("../../config.json");
const { magenta, white, green, red } = require("chalk");
const { loadCommands } = require("../../Handlers/Command");
const Levels = require("discord.js-leveling");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(
      magenta("Discord API") +
        white(" · Logged in as ") +
        green(`${client.user.tag}`)
    );

    loadCommands(client);

    Levels.setURL(config.mongodb);

    connect(config.mongodb)
      .then(() => {
        console.log(
          magenta("Database") +
            white(" · ") +
            green(`${client.user.username} `) +
            white("has successfully connected to the database.")
        );
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
