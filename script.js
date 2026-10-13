const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const loginTab = document.querySelector("#login-tab");
const registerTab = document.querySelector("#register-tab");
const title = document.querySelector("#form-title");
const eyebrow = document.querySelector("#form-eyebrow");
const subtitle = document.querySelector("#form-subtitle");
const statusMessage = document.querySelector("#status-message");

function setMode(mode) {
  const isLogin = mode === "login";
  loginForm.classList.toggle("is-hidden", !isLogin);
  registerForm.classList.toggle("is-hidden", isLogin);
  loginTab.classList.toggle("active", isLogin);
  registerTab.classList.toggle("active", !isLogin);
  loginTab.setAttribute("aria-selected", String(isLogin));
  registerTab.setAttribute("aria-selected", String(!isLogin));
  title.textContent = isLogin ? "Sign in to your account" : "Create your account";
  eyebrow.textContent = isLogin ? "WELCOME BACK" : "GET STARTED TODAY";
  subtitle.textContent = isLogin ? "Enter your details below to continue." : "A few details and you’ll be ready to go.";
  statusMessage.textContent = "";
  statusMessage.classList.remove("error");
}

loginTab.addEventListener("click", () => setMode("login"));
registerTab.addEventListener("click", () => setMode("register"));
document.querySelectorAll("[data-switch]").forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.switch));
});

function validateForm(form) {
  let valid = true;
  form.querySelectorAll(".field").forEach((field) => {
    const input = field.querySelector("input");
    const error = field.querySelector(".field-error");
    let message = "";
    if (!input.checkValidity()) {
      if (input.validity.valueMissing) message = "Please fill out this field.";
      else if (input.validity.typeMismatch) message = "Enter a valid email address.";
      else if (input.validity.tooShort) message = `Use at least ${input.minLength} characters.`;
      else message = "Please check this field.";
    }
    input.setAttribute("aria-invalid", String(Boolean(message)));
    error.textContent = message;
    if (message) valid = false;
  });
  const terms = form.querySelector("#terms");
  if (terms && !terms.checked) valid = false;
  return valid;
}

document.querySelectorAll(".account-form input").forEach((input) => {
  input.addEventListener("input", () => {
    input.removeAttribute("aria-invalid");
    const error = input.closest(".field")?.querySelector(".field-error");
    if (error) error.textContent = "";
    statusMessage.textContent = "";
  });
});

document.querySelectorAll(".account-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    statusMessage.classList.remove("error");
    if (!validateForm(form)) {
      statusMessage.textContent = form.querySelector("#terms") && !form.querySelector("#terms").checked
        ? "Please agree to the terms to continue."
        : "Please correct the highlighted fields.";
      statusMessage.classList.add("error");
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    // This is a front-end demonstration: no credentials are sent or stored.
    statusMessage.textContent = form.id === "login-form"
      ? "Looks good! Connect a backend to sign in."
      : "Details look good! Connect a backend to create your account.";
  });
});

document.querySelector("#forgot-link").addEventListener("click", (event) => {
  event.preventDefault();
  statusMessage.classList.remove("error");
  statusMessage.textContent = "Password reset would be connected to your account service.";
});
