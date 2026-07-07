const API_URL = "https://script.google.com/macros/s/AKfycbylNf4C-lGPTj3azmJhqzXAMRrev-5YkFHyzSomg0hmG5WXHzXeNpVlb85WHJLcxVt7/exec";

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
    const itemText = item.querySelector("p").textContent;
    const itemId = itemText.split(" ")[0];

    try {
      const response = await fetch(`${API_URL}?action=check&itemId=${encodeURIComponent(itemId)}`);
      const result = await response.json();

      if (result.exists) {
        item.classList.add("has-post");
      } else {
        item.classList.remove("has-post");
      }
    } catch (error) {
      console.error(error);
    }
  }
}

items.forEach((item) => {
  item.addEventListener("click", async () => {
    const itemName = item.querySelector("p").textContent;
    selectedItemId = itemName.split(" ")[0];

    try {
      const response = await fetch(`${API_URL}?action=check&itemId=${encodeURIComponent(selectedItemId)}`);
      const result = await response.json();

      if (!result.exists) {
        window.location.href = `write.html?id=${selectedItemId}`;
        return;
      }

      modalItemName.textContent = itemName;
      passwordInput.value = "";
      passwordMessage.textContent = "";
      modal.classList.add("show");
      passwordInput.focus();

    } catch (error) {
      console.error(error);
      alert("게시글 확인 중 오류가 발생했습니다.");
    }
  });
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});

enterPassword.addEventListener("click", checkPassword);

passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") checkPassword();
});

async function checkPassword() {
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

    if (result.ok) {
      sessionStorage.setItem("postPassword", password);
      window.location.href = `post.html?id=${selectedItemId}`;
    } else {
      passwordMessage.textContent = "wrong password";
    }

  } catch (error) {
    console.error(error);
    passwordMessage.textContent = "error";
  }
}

checkExistingPosts();
