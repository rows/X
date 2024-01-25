/** @type {import('jest-environment-puppeteer').JestPuppeteerConfig} */
const puppeteer = require("puppeteer");

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
