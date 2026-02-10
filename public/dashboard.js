const gymId = 1; // demo gym

// TODAY ATTENDANCE COUNT
fetch(`/attendance/today?gym_id=${gymId}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("todayCount").innerText =
      `Total check-ins today: ${data.count}`;
  })
  .catch(() => {
    document.getElementById("todayCount").innerText =
      "Attendance API not connected";
  });

// ADD MEMBER
function addMember() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const validTill = document.getElementById("validTill").value;

  fetch("/auth/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      phone,
      gym_id: gymId,
      start_date: new Date().toISOString().slice(0, 10),
      valid_till: validTill
    })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("addMemberMsg").innerText =
        "✅ Member added successfully";
    })
    .catch(() => {
      document.getElementById("addMemberMsg").innerText =
        "❌ Error adding member";
    });
}

// ABSENT
function loadAbsent() {
  fetch(`/notify/absent?gym_id=${gymId}`)
    .then(res => res.json())
    .then(data => {
      renderMessages("absentList", data.messages);
    });
}

// EXPIRED
function loadExpired() {
  fetch(`/notify/expired?gym_id=${gymId}`)
    .then(res => res.json())
    .then(data => {
      renderMessages("expiredList", data.messages);
    });
}

// EXPIRING
function loadExpiring() {
  fetch(`/notify/expiring?gym_id=${gymId}`)
    .then(res => res.json())
    .then(data => {
      renderMessages("expiringList", data.messages);
    });
}

// COMMON RENDER
function renderMessages(containerId, messages) {
  const box = document.getElementById(containerId);
  box.innerHTML = "";

  if (messages.length === 0) {
    box.innerHTML = "<p>No members</p>";
    return;
  }

  messages.forEach(m => {
    const waLink = `https://wa.me/91${m.phone}?text=${encodeURIComponent(m.message)}`;
    const div = document.createElement("div");
    div.className = "msg";
    div.innerHTML = `
      ${m.message}<br/>
      <a href="${waLink}" target="_blank">📲 Send WhatsApp</a>
    `;
    box.appendChild(div);
  });
}
