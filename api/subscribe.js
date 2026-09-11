const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const email = String(request.body?.email || '').trim().toLowerCase();

  if (!EMAIL_PATTERN.test(email) || email.length > 320) {
    return response.status(400).json({ error: 'Adresse e-mail invalide.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Variables Supabase absentes.');
    return response.status(503).json({ error: 'Service temporairement indisponible.' });
  }

  try {
    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ email, source: 'landing-page' })
    });

    // Une adresse déjà inscrite reçoit la même réponse afin de ne rien révéler.
    if (supabaseResponse.ok || supabaseResponse.status === 409) {
      return response.status(200).json({ success: true });
    }

    console.error('Erreur Supabase:', supabaseResponse.status);
    return response.status(502).json({ error: 'Impossible d’enregistrer cette adresse.' });
  } catch (error) {
    console.error('Erreur réseau Supabase:', error);
    return response.status(502).json({ error: 'Impossible de joindre le service.' });
  }
};
