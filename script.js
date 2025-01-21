const form = document.getElementById('registration-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); 

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  document.getElementById('username-error').textContent = '';
  document.getElementById('email-error').textContent = '';
  document.getElementById('password-error').textContent = '';

  try {
    const response = await fetch('/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errors = await response.json();
      if (errors.username) document.getElementById('username-error').textContent = errors.username;
      if (errors.email) document.getElementById('email-error').textContent = errors.email;
      if (errors.password) document.getElementById('password-error').textContent = errors.password;
    } else {
      alert('Registrace proběhla úspěšně!');
      form.reset();
    }
  } catch (error) {
    console.error('Došlo k chybě:', error);
  }
});
