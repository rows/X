module.exports = {
  launch: {
    dumpio: false,
    headless: false,
    args: [
      '--disable-extensions-except=./dist',
      '--load-extension=./dist',
    ],
  },
};
