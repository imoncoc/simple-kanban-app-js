document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    const userId = document.getElementById("userId").value;
    const userName = document.getElementById("userName").value;
    const userEmail = document.getElementById("userEmail").value;
    const userPassword = document.getElementById("userPassword").value;

    // Create the user object
    const user = {
      Id: userId,
      name: userName,
      email: userEmail,
      password: userPassword,
    };

    // Save the user object in localStorage
    localStorage.setItem("user", JSON.stringify(user));

    alert("User information saved to localStorage!");
  });
