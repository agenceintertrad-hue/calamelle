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

  const config = window.CALAMELLE_CONFIG || {};
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    showMessage('L’inscription sera disponible très prochainement.');
    return;
  }

  email.removeAttribute('aria-invalid');
  button.disabled = true;
  button.textContent = 'Envoi…';

  try {
    const response = await fetch(`${config.supabaseUrl}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${config.supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        email: email.value.trim().toLowerCase(),
        source: 'landing-page'
      })
    });

    if (!response.ok && response.status !== 409) throw new Error(`Supabase: ${response.status}`);

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
