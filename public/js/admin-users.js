async function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    console.log(`deleting .${userId}`);
    const res = await fetch(`/admin/users/${userId}`, {
        method: "DELETE",
    });
    if (res.ok) {
        location.reload();
    } else {
        alert("Failed to delete user.");
    }
}
function toggleAddUserForm() {
  const form = document.getElementById("addUserForm");
  form.style.display = form.style.display === "none" ? "block" : "none";
}
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newUserForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const body = Object.fromEntries(formData.entries());

      try {
        const res = await fetch("/admin/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          alert("User added successfully.");
          location.reload(); // Refresh to show new user
        } else {
          const err = await res.json();
          alert(err.error || "Error adding user.");
        }
      } catch (err) {
        console.error(err);
        alert("Unexpected error.");
      }
    });
  }
});