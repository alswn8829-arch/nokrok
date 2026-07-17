const API_URL =
  "https://script.google.com/macros/s/AKfycbzwVn-M3tI8inBD8PkSc4C7x1IPtHwwy0ZShP1H8tBCez25ph02Xn30ZXTV5DWLkWeNdw/exec";

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

const id = params.get("id");
const password = params.get("password");

const itemTitle = document.getElementById("itemTitle");
const postText = document.getElementById("postText");

const replySection =
  document.getElementById("replySection");
const replyText =
  document.getElementById("replyText");
const replyDate =
  document.getElementById("replyDate");

const replyForm =
  document.getElementById("replyForm");
const replyInput =
  document.getElementById("replyInput");
const replyButton =
  document.getElementById("replyButton");

itemTitle.textContent =
  itemNames[id] || "unknown item";

if (!id || !password) {
  window.location.href = "board.html";
} else {
  loadPost();
}

async function loadPost() {
  try {
    const response = await fetch(
      `${API_URL}?action=read` +
      `&itemId=${encodeURIComponent(id)}` +
      `&password=${encodeURIComponent(password)}`
    );

    const result = await response.json();

    if (!result.ok) {
      alert("wrong password");
      window.location.href = "board.html";
      return;
    }

    const post = result.post;

    postText.textContent =
`${post.title}

from. ${post.name}

${post.message}`;

    showReply(post);

    if (result.role === "admin") {
      replyForm.hidden = false;
      replyInput.value = post.reply || "";
    }
  } catch (error) {
    console.error(error);
    postText.textContent =
      "게시글을 불러오지 못했습니다.";
  }
}

function showReply(post) {
  if (!post.reply) {
    replySection.hidden = true;
    return;
  }

  replySection.hidden = false;
  replyText.textContent = post.reply;

  replyDate.textContent = post.repliedAt
    ? post.repliedAt
    : "";
}

replyForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const reply = replyInput.value.trim();

  if (!reply) {
    alert("답글을 입력해 주세요.");
    return;
  }

  replyButton.disabled = true;
  replyButton.textContent = "sending...";

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        action: "reply",
        itemId: id,
        adminPassword: password,
        reply: reply
      })
    });

    alert("답글이 저장되었습니다.");

    setTimeout(() => {
      window.location.reload();
    }, 1000);

  } catch (error) {
    console.error(error);
    alert("답글 저장 중 오류가 발생했습니다.");

    replyButton.disabled = false;
    replyButton.textContent = "send reply";
  }
});
