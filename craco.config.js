const path = require("path");
module.exports = {
  webpack: {
    alias: {
      '@root': path.resolve(__dirname, "src/"),
      '@routes': path.resolve(__dirname, "src/routes/"),
      '@archetypes': path.resolve(__dirname, "src/archetypes/"),
      '@components': path.resolve(__dirname, "src/components/"),
      '@assets': path.resolve(__dirname, "src/assets/"),
      '@libs': path.resolve(__dirname, "src/libs/"),
      '@util': path.resolve(__dirname, "src/util/")
    }
  }
}