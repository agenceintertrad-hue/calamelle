const form = document.querySelector('#signup-form');
const email = document.querySelector('#email');
const message = document.querySelector('#form-message');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  message.classList.remove('is-success');

  if (!email.validity.valid) {
    email.setAttribute('aria-invalid', 'true');
    message.textContent = 'Veuillez saisir une adresse e-mail valide.';
    email.focus();
    return;
  }

  email.removeAttribute('aria-invalid');
  message.classList.add('is-success');
  message.textContent = 'Merci — nous vous écrirons dès l’ouverture de Calamelle.';
  form.reset();
});

email.addEventListener('input', () => {
  email.removeAttribute('aria-invalid');
  message.textContent = '';
  message.classList.remove('is-success');
});
