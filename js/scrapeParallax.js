const puppeteer = require("puppeteer");
const fs = require("fs/promises");

const getPages = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://parallaxphotographic.coop/product-category/film/");
  const pageLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".product-images a")).map(
      (links) => links.href
    );
  });
  await fs.writeFile("../assets/data/links.txt", pageLinks.join("\r\n"));
  await browser.close();
  return pageLinks;
};

const eachPage = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const data = await page.evaluate(() => {
    const title = document.querySelector(".entry-summary h1").innerText;
    const info = document.querySelector(
      ".entry-summary .woocommerce-product-details__short-description"
    ).innerText;
    const meta = Array.from(
      document.querySelectorAll(".entry-summary .product_meta a")
    ).map((link) => link.innerText);
    let style = "";
    if (meta.includes("Colour Film")) style = "colour";
    if (meta.includes("Black and White Film")) style = "black and white";
    return { title, info, style };
  });
  await page.click("#tab-title-additional_information > a");
  const { iso, format } = await page.evaluate(() => {
    const iso = document
      .querySelector(
        "#tab-additional_information > table > tbody > tr.woocommerce-product-attributes-item.woocommerce-product-attributes-item--attribute_pa_film-sensitivity > td > p > a"
      )
      .innerText.slice(0, -3)
      .trim();
    const format = document.querySelector(
      "#tab-additional_information > table > tbody > tr.woocommerce-product-attributes-item.woocommerce-product-attributes-item--attribute_pa_film-format > td > p > a"
    ).innerText;
    return { iso, format };
  });
  data.iso = iso;
  data.format = format;
  await browser.close();
  return data;
};

const tasks = async () => {
  const pages = [...(await getPages())];
  const data = [];

  let i = 0;
  console.log("number of pages", pages.length);
  while (i < pages.length) {
    console.log("page", i);
    data.push(await eachPage(pages[i]));
    i++;
  }

  await fs.writeFile("../assets/data/data.json", JSON.stringify(data));
};

tasks();
