function toggleAddMenuForm() {
    const form = document.getElementById('addMenuItemForm');
    form.style.display = form.style.display === "none" ? "block" : "none";
}
function togglePrimaryCategory() {
    const form = document.getElementById('addPrimaryForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}
function toggleSecondaryCategory() {
    const form = document.getElementById('addSecondaryForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newPrimaryForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const body = Object.fromEntries(formData.entries());

      try {
        const res = await fetch("/admin/menu/primary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          alert("Primary Category added successfully.");
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
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newSecondaryForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const body = Object.fromEntries(formData.entries());

      try {
        const res = await fetch("/admin/menu/secondary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          alert("Secondary Category added successfully.");
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
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newItemForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const body = Object.fromEntries(formData.entries());

      try {
        const res = await fetch("/admin/menu", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          alert("Item added successfully.");
          location.reload(); // Refresh to show new user
        } else {
          const err = await res.json();
          alert(err.error || "Error adding item in menu.");
        }
      } catch (err) {
        console.error(err);
        alert("Unexpected error.");
      }
    });
  }
});
async function deletePrimary(categoryId) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    console.log(`deleting .${categoryId}`);
    const res = await fetch(`/admin/menu/primary/${categoryId}`, {
        method: "DELETE",
    });
    if (res.ok) {
        location.reload();
    } else {
        alert("Failed to delete category.");
    }
}
async function deleteSecondary(categoryId) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    console.log(`deleting .${categoryId}`);
    const res = await fetch(`/admin/menu/secondary/${categoryId}`, {
        method: "DELETE",
    });
    if (res.ok) {
        location.reload();
    } else {
        alert("Failed to delete category.");
    }
}
async function deleteMenuItem(categoryId) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    console.log(`deleting .${categoryId}`);
    const res = await fetch(`/admin/menu/${categoryId}`, {
        method: "DELETE",
    });
    if (res.ok) {
        location.reload();
    } else {
        alert("Failed to delete category.");
    }
}