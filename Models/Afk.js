const { model, Schema } = require("mongoose");

let afkSchema = new Schema({
  GuildId: String,
  UserID: String,
  Afk: Boolean,
});

module.exports = model("AFK", afkSchema);
