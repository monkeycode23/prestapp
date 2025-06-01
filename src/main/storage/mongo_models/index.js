const fs = require("fs");
const path = require("path");

const models = {};

fs.readdirSync(__dirname).forEach((file) => {
  if (file !== "index.js" && file.endsWith(".js")) {
    const model = require(path.join(__dirname, file));
    models[model.modelName] = model;
  }
});

module.exports = models;