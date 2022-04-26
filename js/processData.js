var fs = require("fs");
var fs_promises = require("fs/promises");

const getData = () => {
  return JSON.parse(fs.readFileSync("../assets/data/data.json"));
};

const parseInfo = (string) => {
  string.replace("\n", " ");
  const periodIndex = string.lastIndexOf(".");
  return string.slice(0, periodIndex + 1).trim();
};

const parseTitle = (title) => {
  const words = title.split(" ");
  if (words.includes("Film")) {
    words.splice(words.indexOf("Film"), 1);
  }
  if (words.includes("35mm")) {
    words.splice(words.indexOf("35mm"), 1);
  }
  if (words.includes("120")) {
    words.splice(words.indexOf("120"), 1);
  }
  const newTitle = words.slice(0, 4).join(" ");
  return newTitle;
};

const removeObjectDuplicates = (array) => {
  return array.filter((obj, index) => {
    return (
      array.findIndex(
        (o) => JSON.stringify(o.name) === JSON.stringify(obj.name)
      ) === index
    );
  });
};

const mergeSameFilms = (array) => {
  return array.filter((obj, index) => {
    return (
      array.findIndex(
        (o) =>
          JSON.stringify(o.name.split(" ").slice(0, 2).join(" ").trim()) ===
          JSON.stringify(obj.name.split(" ").slice(0, 2).join(" ").trim())
      ) === index
    );
  });
};

const processData = () => {
  const data = getData();
  const formattedData = data.map((item) => {
    const newFormat = item.format === "35mm" ? "120" : "35mm";
    return {
      name: parseTitle(item.title),
      info: item.info.length <= 250 ? item.info : parseInfo(item.info),
      rating: [],
      style: item.style,
      iso: Number(item.iso),
      formats: [{ format: item.format }, { format: newFormat }],
    };
  });
  const cleanedData = removeObjectDuplicates(formattedData).sort((a, b) =>
    a.name > b.name ? 1 : -1
  );
  const processedData = mergeSameFilms(cleanedData);
  return JSON.stringify(processedData);
};

const program = async () => {
  const processedData = processData();
  fs_promises.writeFile("../assets/data/processedData.json", processedData);
};

program();
