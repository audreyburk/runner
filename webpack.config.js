module.exports = {
  context: __dirname,
  entry: "./lib/run_script.js",
  output: {
    path: "./",
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["", ".js"]
  },
  devtool: 'source-map'
};
