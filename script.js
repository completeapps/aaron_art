// Simple theme + admin edit mode with localStorage

const ADMIN_PASSWORD = "0000"; // change this later

const DEFAULT_CONTENT = {
  brandName: "",
  tagline: "",
  card1Meta: "",
  card1Title: "",
  card1Text: "",
  card1LinkText: "",
  card1LinkHref: "#",
  card2Meta: "",
  card2Title: "",
  card2Text: "",
  card2LinkText: "",
  card2LinkHref: "#",
  footerMain: "",
  footerSecondary: ""
};

function loadContent() {
  const saved = localStorage.getItem("complete-landing-content");
  let content;
  try {
    content = saved ? JSON.parse(saved) : DEFAULT_CONTENT;
  } catch {
    content = DEFAULT_CONTENT;
  }
  return { ...DEFAULT_CONTENT, ...content };
}

function saveContent(content) {
  localStorage.setItem("complete-landing-content", JSON.stringify(content));
}

function applyContent(content) {
  document.querySelectorAll(".editable").forEach(el => {
    const key = el.dataset.key;
    if (!key) return;
    el.textContent = content[key] || "";
  });

  document.querySelectorAll(".editable-link").forEach(el => {
    const key = el.dataset.key;
    const hrefKey = el.dataset.hrefKey;
    if (key) el.textContent = content[key] || "";
    if (hrefKey) el.href = content[hrefKey] || "#";
  });
}

function initTheme() {
  const body = document.body;
  const modeToggle = document.getElementById("modeToggle");
  const modeIcon = document.getElementById("modeIcon");

  const savedMode = localStorage.getItem("complete-theme");
  if (savedMode === "light") {
    body.classList.add("light");
    modeIcon.textContent = "○";
  } else {
    body.classList.remove("light");
    modeIcon.textContent = "●";
  }

  modeToggle.addEventListener("click", () => {
    const isLight = body.classList.toggle("light");
    localStorage.setItem("complete-theme", isLight ? "light" : "dark");
    modeIcon.textContent = isLight ? "○" : "●";
  });
}

function initAdmin(content) {
  const body = document.body;
  const adminBtn = document.getElementById("adminBtn");
  let currentContent = { ...content };
  let isAdmin = false;

  function enableAdmin() {
    isAdmin = true;
    body.classList.add("admin");
    adminBtn.textContent = "Admin ✓";
  }

  function disableAdmin() {
    isAdmin = false;
    body.classList.remove("admin");
    adminBtn.textContent = "Admin";
  }

  adminBtn.addEventListener("click", () => {
    if (isAdmin) {
      disableAdmin();
      return;
    }
    const attempt = window.prompt("Enter admin password:");
    if (attempt === ADMIN_PASSWORD) {
      enableAdmin();
    } else if (attempt !== null) {
      window.alert("Wrong password");
    }
  });

  document.addEventListener("click", e => {
    if (!isAdmin) return;

    // Editable text
    const editable = e.target.closest(".editable");
    if (editable && editable.dataset.key) {
      const key = editable.dataset.key;
      const current = currentContent[key] || "";
      const next = window.prompt("Edit text:", current);
      if (next !== null) {
        currentContent[key] = next;
        saveContent(currentContent);
        applyContent(currentContent);
      }
      return;
    }

    // Editable link (text + href)
    const link = e.target.closest(".editable-link");
    if (link && link.dataset.key && link.dataset.hrefKey) {
      const textKey = link.dataset.key;
      const hrefKey = link.dataset.hrefKey;

      const currentText = currentContent[textKey] || "";
      const currentHref = currentContent[hrefKey] || "";

      const nextText = window.prompt("Link text:", currentText);
      if (nextText === null) return;

      const nextHref = window.prompt("Link URL (including https://):", currentHref);
      if (nextHref === null) return;

      currentContent[textKey] = nextText;
      currentContent[hrefKey] = nextHref;
      saveContent(currentContent);
      applyContent(currentContent);
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const content = loadContent();
  applyContent(content);
  initTheme();
  initAdmin(content);
});
