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

const params = new URLSearchParams(window.location.search);
const itemId = params.get("id");
const itemName = itemNames[itemId] || "unknown item";

document.getElementById("itemLabel").textContent = itemName;

const form = document.getElementById("writeForm");
const submitBtn = form.querySelector("button");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.textContent = "sending...";

  const body = {
    itemId,
    itemName,
    name: document.getElementById("name").value.trim(),
    password: document.getElementById("password").value.trim(),
    title: document.getElementById("title").value.trim(),
    message: document.getElementById("message").value.trim()
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(body)
    });

    alert("저장되었습니다.");

    window.location.href = `board.html`;

  } catch (err) {
    console.error(err);
    alert("저장 실패");

    submitBtn.disabled = false;
    submitBtn.textContent = "send";
  }
});
