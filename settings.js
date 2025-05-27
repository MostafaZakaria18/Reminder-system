const dummy_user = {
    name:"john doe",
    email:"john@example.com",
    password:"123"
};
const userId =1;

function loadNavbar() {
  fetch("navbar.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data;
    })
    .catch(error => console.error("Failed to load navbar:", error));
}

function fetchUser() {
  fetch(`http://localhost:8070/User/getUser?id=${userId}`)  
    .then(res => res.json())
    .then(user => {
      console.log('fetched user', user.name);
      document.getElementById('display-name').textContent = user.name;
      document.getElementById('display-email').textContent = user.email;
      document.getElementById('display-password').textContent = "••••••••"; // 🔒 Show placeholder only

      // For editing
      document.getElementById('edit-name').value = user.name;
      document.getElementById('edit-password').value = user.password;
    })
    .catch(err => console.error('Error fetching user:', err));
}

function showEditForm() {
  document.getElementById('user-info').classList.add('d-none');
  document.getElementById('edit-form').classList.remove('d-none');
}

function hideEditForm() {
  document.getElementById('edit-form').classList.add('d-none');
  document.getElementById('user-info').classList.remove('d-none');
}

window.addEventListener("DOMContentLoaded", loadNavbar);

function saveUserToStorage(user){
    localStorage.setItem("userSettings", JSON.stringify(user));
}

function saveChanges() {
  const name = document.getElementById('edit-name').value;
  const password = document.getElementById('edit-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const updatedUser = { name, password };

  fetch(`http://localhost:8070/User/putUser?id=${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedUser)
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to update user");
      return res.json();
    })
    .then(() => {
      alert('User updated!');
      hideEditForm();
      fetchUser();
    })
    .catch(err => alert('Failed to update user.'));
}


window.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  fetchUser();
});