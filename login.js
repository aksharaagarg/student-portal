const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  message.textContent = "";

  try {
    const response = await fetch("./users.xml");

    if (!response.ok) {
      throw new Error("Could not load users.xml");
    }

    const xmlText = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    if (xmlDoc.querySelector("parsererror")) {
      throw new Error("Invalid users.xml format");
    }

    const users = xmlDoc.getElementsByTagName("user");
    let isValid = false;

    for (let i = 0; i < users.length; i++) {
      const storedUsername = users[i]
        .getElementsByTagName("username")[0]
        .textContent.trim();

      const storedPassword = users[i]
        .getElementsByTagName("password")[0]
        .textContent.trim();

      if (username === storedUsername && password === storedPassword) {
        isValid = true;
        break;
      }
    }

    if (isValid) {
      window.location.href = "./dashboard.html";
    } else {
      message.textContent = "Invalid username or password.";
    }
  } catch (error) {
    console.error("Login error:", error);
    message.textContent =
      "Could not load login data. Check Live Server and users.xml.";
  }
});
