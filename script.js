async function api(path, data) {
  const res = await fetch("mitsuba-backend.onrender.com" + path, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });
  return await res.json();
}
async function getProfile() {
  const user_id = localStorage.getItem("user_id");

  const data = await api("/profile/get", { user_id });

  if (data.success) {
    document.getElementById("username").innerText = data.username;
    document.getElementById("bio").value = data.bio || "";
  } else {
    alert("プロフィール取得に失敗しました");
  }
}
async function updateProfile() {
  const user_id = localStorage.getItem("user_id");
  const bio = document.getElementById("bio").value;

  const data = await api("/profile/update", { user_id, bio });

  if (data.success) {
    alert("プロフィールを更新しました！");
  } else {
    alert("更新に失敗しました");
  }
}
async function adminLogin() {
  const token = document.getElementById("token").value;

  const data = await api("/admin/token", { token });

  if (data.success) {
    localStorage.setItem("admin_token", token);
    location.href = "admin_panel.html";
  } else {
    alert("トークンが違います");
  }
}
async function loadUsers() {
  const token = localStorage.getItem("admin_token");

  const data = await api("/admin/users", { token });

  if (!data.success) {
    alert("権限がありません");
    return;
  }

  const list = document.getElementById("userList");
  list.innerHTML = "";

  data.users.forEach(u => {
    const li = document.createElement("li");
    li.innerHTML = `${u[0]} : ${u[1]} (${u[2] || ""}) 
      <button onclick="deleteUser(${u[0]})">削除</button>`;
    list.appendChild(li);
  });
}
async function deleteUser(id) {
  const token = localStorage.getItem("admin_token");

  const data = await api("/admin/delete_user", {
    token,
    user_id: id
  });

  if (data.success) {
    alert("削除しました");
    loadUsers(); // 再読み込み
  } else {
    alert("削除に失敗しました");
  }
}
