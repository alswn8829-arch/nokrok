const API_URL = "https://script.google.com/macros/s/AKfycbzwVn-M3tI8inBD8PkSc4C7x1IPtHwwy0ZShP1H8tBCez25ph02Xn30ZXTV5DWLkWeNdw/exec";

const items = document.querySelectorAll(".item");
const modal = document.getElementById("passwordModal");
const closeModal = document.getElementById("closeModal");
const modalItemName = document.getElementById("modalItemName");
const passwordInput = document.getElementById("passwordInput");
const enterPassword = document.getElementById("enterPassword");
const passwordMessage = document.getElementById("passwordMessage");

let selectedItemId = null;

async function checkExistingPosts() {

  for (const item of items) {

    const itemId = item.querySelector("p").textContent.split(" ")[0];

    try {

      const response = await fetch(
        `${API_URL}?action=check&itemId=${encodeURIComponent(itemId)}`
      );

      const result = await response.json();

      if (result.exists) {
        item.classList.add("has-post");
      } else {
        item.classList.remove("has-post");
      }

    } catch (e) {
      console.error(e);
    }

  }

}

items.forEach(item => {

  item.addEventListener("click", async () => {

    selectedItemId = item.querySelector("p").textContent.split(" ")[0];

    try {

      const response = await fetch(
        `${API_URL}?action=check&itemId=${encodeURIComponent(selectedItemId)}`
      );

      const result = await response.json();

      if (!result.exists) {

        window.location.href = `write.html?id=${selectedItemId}`;
        return;

      }

      modalItemName.textContent = item.querySelector("p").textContent;
      passwordInput.value = "";
      passwordMessage.textContent = "";

      modal.classList.add("show");
      passwordInput.focus();

    } catch (e) {

      console.error(e);
      alert("게시글 확인 실패");

    }

  });

});

closeModal.onclick = () => {

  modal.classList.remove("show");

};

enterPassword.onclick = openPost;

passwordInput.addEventListener("keydown", e => {

  if (e.key === "Enter") {

    openPost();

  }

});

async function openPost() {

  const password = passwordInput.value.trim();

  if (!password) {

    passwordMessage.textContent = "enter password";
    return;

  }

  try {

    const response = await fetch(
      `${API_URL}?action=read&itemId=${encodeURIComponent(selectedItemId)}&password=${encodeURIComponent(password)}`
    );

    const result = await response.json();

    if (!result.ok) {

      passwordMessage.textContent = "wrong password";
      return;

    }

    window.location.href =
      `post.html?id=${selectedItemId}&password=${encodeURIComponent(password)}`;

  } catch (e) {

    console.error(e);
    passwordMessage.textContent = "error";

  }

}

checkExistingPosts();
