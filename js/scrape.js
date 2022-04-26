const puppeteer = require("puppeteer");
const fs = require("fs/promises");

const start = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://learnwebcode.github.io/practice-requests");

  const names = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".info strong")).map(
      (x) => x.textContent
    );
  });
  await fs.writeFile("../assets/data/names.txt", names.join("\r\n"));

  const photos = page.$$eval("img", (imgs) => {
    return imgs.map((img) => img.src);
  });

  await browser.close();
};

start();
