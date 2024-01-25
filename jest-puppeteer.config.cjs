/** @type {import('jest-environment-puppeteer').JestPuppeteerConfig} */
const puppeteer = require("puppeteer");

module.exports = {
  launch: {
    dumpio: true,
    headless: true,
    args: [
      '--disable-extensions-except=./dist',
      '--load-extension=./dist',
    ],
  },
};
