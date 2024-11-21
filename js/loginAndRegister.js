function handleRegister(event) {
  event?.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  if (!name || !email || !password) {
    alert("Please fill in all the fields!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    alert("User with this email already exists!");
    return;
  }

  const newUser = {
    id: new Date().getTime(),
    name,
    email,
    password,
  };

  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("registerName").value = "";
  document.getElementById("registerEmail").value = "";
  document.getElementById("registerPassword").value = "";

  alert("Registration successful!");
  window.location.href = "index.html";
}

function handleLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please fill in both email and password!");
    return;
  }
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("loginCredentials", JSON.stringify(user));
    alert("Login successful!");
    window.location.href = "home.html";
  } else {
    alert("Invalid email or password!");
  }
}
