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

const itemLabel = document.getElementById("itemLabel");
const writeForm = document.getElementById("writeForm");
const submitButton = writeForm.querySelector("button[type='submit']");

itemLabel.textContent = itemName;

writeForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  submitButton.disabled = true;
  submitButton.textContent = "sending...";

  const name = document.getElementById("name").value.trim();
  const password = document.getElementById("password").value.trim();
  const title = document.getElementById("title").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!itemId) {
    alert("아이템 정보가 없습니다.");
    submitButton.disabled = false;
    submitButton.textContent = "send";
    return;
  }

  if (!name || !password || !title || !message) {
    alert("모든 칸을 입력해 주세요.");
    submitButton.disabled = false;
    submitButton.textContent = "send";
    return;
  }

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        itemId,
        itemName,
        name,
        password,
        title,
        message
      })
    });

    sessionStorage.setItem("postPassword", password);

    alert("저장 요청을 보냈습니다. Google Sheets를 확인해 주세요.");
    window.location.href = `post.html?id=${itemId}`;

  } catch (error) {
    console.error(error);
    alert("저장 중 오류가 발생했습니다.");
    submitButton.disabled = false;
    submitButton.textContent = "send";
  }
});
