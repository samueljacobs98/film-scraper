const puppeteer = require("puppeteer");

const getScreenshot = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://parallaxphotographic.coop/");
  await page.setViewport({ width: 1920, height: 1080 });
  await page.screenshot({
    path: "../assets/images/parallax.png",
    fullPage: true,
  });
  await browser.close();
};

getScreenshot();
