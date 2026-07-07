const API_URL = "https://script.google.com/macros/s/AKfycbylNf4C-lGPTj3azmJhqzXAMRrev-5YkFHyzSomg0hmG5WXHzXeNpVlb85WHJLcxVt7/exec";

const itemNames = {
  "001": "001 portrait",
  "002": "002 camera",
  "003": "003 postcard",
  "004": "004 spider",
  "005": "005 pineapple",
  "006": "006 beer girl",
  "007": "007 red shoes",
  "008": "008 white ferret",
  "009": "009 rock",
  "010": "010 mp3"
};

const params = new URLSearchParams(location.search);

const id = params.get("id");
const password = params.get("password");

document.getElementById("itemTitle").textContent =
  itemNames[id] || "unknown item";

if (!password) {
  location.href = "board.html";
}

load();

async function load() {

  try {

    const response = await fetch(
      `${API_URL}?action=read&itemId=${encodeURIComponent(id)}&password=${encodeURIComponent(password)}`
    );

    const result = await response.json();

    if (!result.ok) {
      alert("wrong password");
      location.href = "board.html";
      return;
    }

    const post = result.post;

    document.getElementById("postText").textContent =
`${post.title}

from. ${post.name}

${post.message}`;

  } catch (err) {

    console.error(err);

    document.getElementById("postText").textContent =
      "게시글을 불러오지 못했습니다.";

  }

}
