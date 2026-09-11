const form = document.querySelector('#signup-form');
const email = document.querySelector('#email');
const website = document.querySelector('#website');
const button = form.querySelector('button[type="submit"]');
const message = document.querySelector('#form-message');
const defaultButtonLabel = button.textContent;

function showMessage(text, success = false) {
  message.textContent = text;
  message.classList.toggle('is-success', success);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (website.value) return;

  if (!email.validity.valid) {
    email.setAttribute('aria-invalid', 'true');
    showMessage('Veuillez saisir une adresse e-mail valide.');
    email.focus();
    return;
  }

  email.removeAttribute('aria-invalid');
  button.disabled = true;
  button.textContent = 'Envoi…';

  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value.trim().toLowerCase()
      })
    });

    if (!response.ok) throw new Error(`Inscription: ${response.status}`);

    showMessage('Merci — nous vous écrirons dès l’ouverture de Calamelle.', true);
    form.reset();
  } catch (error) {
    console.error(error);
    showMessage('L’inscription n’a pas pu aboutir. Veuillez réessayer dans un instant.');
  } finally {
    button.disabled = false;
    button.textContent = defaultButtonLabel;
  }
});

email.addEventListener('input', () => {
  email.removeAttribute('aria-invalid');
  showMessage('');
});
