import data from "../assets/data/processedData.json" assert { type: "json" };
const button = document.querySelector(".post-button");

const postRequest = (url, postData) => {
  console.log(postData.name);
  fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(postData),
  });
};

const program = () => {
  console.log(data);
  data.forEach((postData) => {
    postRequest("https://darkroomdb.nw.r.appspot.com/film", postData);
  });
};

button.addEventListener("click", program);
