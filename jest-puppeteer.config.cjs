module.exports = {
  launch: {
    dumpio: false,
    headless:  'new',
    args: [
      '--disable-extensions-except=./dist',
      '--load-extension=./dist',
    ],
  },
};
