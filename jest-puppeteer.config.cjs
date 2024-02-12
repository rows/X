module.exports = {
  launch: {
    dumpio: false,
    headless: true,
    args: [
      '--disable-extensions-except=./dist',
      '--load-extension=./dist',
    ],
},
};
