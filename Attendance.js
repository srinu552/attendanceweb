document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("registerBtn");
  const loginBtn = document.getElementById("loginBtn");
  const clockInBtn = document.getElementById("clockInBtn");
  const clockOutBtn = document.getElementById("clockOutBtn");
  const fetchReportBtn = document.getElementById("fetchReportBtn");

  // --- Registration Page ---
  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!username || !password) {
        alert("Please enter username and password");
        return;
      }

      localStorage.setItem("user", JSON.stringify({ username, password }));
      alert("Registration successful ✅");
      window.location.href = "login.html";
    });
  }

  // --- Login Page ---
  if (loginBtn) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const loginUsername = document.getElementById("loginUsername").value.trim();
      const loginPassword = document.getElementById("loginPassword").value.trim();
      const user = JSON.parse(localStorage.getItem("user"));

      if (user && user.username === loginUsername && user.password === loginPassword) {
        localStorage.setItem("loggedInUser", loginUsername);
        alert("Login successful ✅");
        window.location.href = "Attendance.html";
      } else {
        alert("Invalid username or password ❌. Please register first.");
      }
    });
  }

  // --- Attendance Page ---
  if (clockInBtn && clockOutBtn && fetchReportBtn) {
    const username = localStorage.getItem("loggedInUser");
    if (username) {
      document.querySelector(".names p").innerHTML = `<b>Name: ${username}</b>`;
    } else {
      // if no login, redirect to login
      window.location.href = "login.html";
    }

    const messageBox = document.getElementById("messageBox");
    const historyBox = document.getElementById("historyBox");

    clockInBtn.addEventListener("click", () => {
      saveAttendance(username, "Clock In");
      messageBox.innerHTML = `<p style="color:green;">✅ You clocked in at ${new Date().toLocaleString()}</p>`;
    });

    clockOutBtn.addEventListener("click", () => {
      saveAttendance(username, "Clock Out");
      messageBox.innerHTML = `<p style="color:red;">✅ You clocked out at ${new Date().toLocaleString()}</p>`;
    });

    fetchReportBtn.addEventListener("click", () => {
      const history = JSON.parse(localStorage.getItem("attendance")) || [];
      const userHistory = history.filter(h => h.username === username);

      if (userHistory.length === 0) {
        historyBox.innerHTML = "<p>No attendance history found ❌</p>";
      } else {
        historyBox.innerHTML = `
          <h4>Your Attendance History:</h4>
          <ul>
            ${userHistory.map(h => `<li>${h.action} - ${h.time}</li>`).join("")}
          </ul>
        `;
      }
    });
  }
});

// --- Save Attendance Helper ---
function saveAttendance(username, action) {
  const history = JSON.parse(localStorage.getItem("attendance")) || [];
  history.push({
    username,
    action,
    time: new Date().toLocaleString()
  });
  localStorage.setItem("attendance", JSON.stringify(history));
}
