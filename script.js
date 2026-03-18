const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const variantButtons = document.querySelectorAll(".variant-button");
const countdown = document.querySelector(".countdown");
const inventoryCount = document.getElementById("inventory-count");
const forms = document.querySelectorAll(".lead-form");

function setVariant(variant) {
  body.dataset.state = variant;

  variantButtons.forEach((button) => {
    const isActive = button.dataset.variant === variant;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function updateCountdown() {
  if (!countdown) return;

  const target = new Date(countdown.dataset.targetDate).getTime();
  const now = Date.now();
  const diff = Math.max(target - now, 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdown.querySelector('[data-unit="days"]').textContent = String(days).padStart(2, "0");
  countdown.querySelector('[data-unit="hours"]').textContent = String(hours).padStart(2, "0");
  countdown.querySelector('[data-unit="minutes"]').textContent = String(minutes).padStart(2, "0");
  countdown.querySelector('[data-unit="seconds"]').textContent = String(seconds).padStart(2, "0");
}

function updateInventory() {
  if (!inventoryCount) return;

  const launchDate = new Date("2026-03-14T09:00:00+05:30").getTime();
  const elapsedHours = Math.max(0, Math.floor((Date.now() - launchDate) / (1000 * 60 * 60)));
  const remaining = Math.max(18, 150 - Math.floor(elapsedHours / 3));
  inventoryCount.textContent = remaining;
}

function showFormMessage(form, message, isError = false) {
  const feedback = form.querySelector(".form-feedback");
  feedback.textContent = message;
  feedback.classList.toggle("is-error", isError);
  feedback.classList.toggle("is-success", !isError);
}

function validateForm(form) {
  const requiredFields = form.querySelectorAll("[required]");

  for (const field of requiredFields) {
    if (!field.value.trim()) {
      showFormMessage(form, "Please complete all required fields.", true);
      field.focus();
      return false;
    }

    if (field.type === "email" && !field.validity.valid) {
      showFormMessage(form, "Enter a valid email address.", true);
      field.focus();
      return false;
    }
  }

  return true;
}

navToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

variantButtons.forEach((button) => {
  button.addEventListener("click", () => setVariant(button.dataset.variant));
});

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm(form)) return;

    form.reset();

    if (form.id === "interest-form") {
      showFormMessage(form, "Interest registered. You'll receive launch notice and early-access details.");
    } else {
      showFormMessage(form, "Reservation details captured. Connect Stripe or PayPal at handoff for live deposits.");
    }
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    const target = targetId ? document.querySelector(targetId) : null;

    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

updateCountdown();
updateInventory();
setInterval(updateCountdown, 1000);
setInterval(updateInventory, 60000);
