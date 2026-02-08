async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://your-render-app.onrender.com/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("user_id", data.user_id);
    location.href = "app.html";
  } else {
    alert("ログイン失敗");
  }
}
async function registerUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://your-render-app.onrender.com/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    alert("登録完了！");
    location.href = "login.html";
  } else {
    alert("登録失敗：" + data.error);
  }
}
