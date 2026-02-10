const API = "http://127.0.0.1:5000";

async function login() {
  const phone = document.getElementById("phone").value;

  const res = await fetch(`${API}/members/by-phone?phone=${phone}`);
  const data = await res.json();

  if (!data.id) {
    document.getElementById("msg").innerText = "Member not found";
    return;
  }

  localStorage.setItem("member_id", data.id);
  window.location.href = "/member-dashboard.html";
}

async function loadMember() {
  const id = localStorage.getItem("member_id");
  if (!id) return;

  const res = await fetch(`${API}/members/${id}`);
  const m = await res.json();

  document.getElementById("name").innerText = `Hi ${m.name}`;
  document.getElementById("valid").innerText =
    new Date(m.valid_till) < new Date()
      ? "❌ Membership expired"
      : `✅ Valid till: ${m.valid_till}`;

  const att = await fetch(`${API}/attendance/member/${id}`);
  const list = await att.json();

  list.forEach(a => {
    const li = document.createElement("li");
    li.innerText = a.date;
    document.getElementById("list").appendChild(li);
  });
}

loadMember();
