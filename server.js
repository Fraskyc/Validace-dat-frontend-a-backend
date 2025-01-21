
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;


const users = [
  { username: 'existingUser', email: 'user@example.com' }
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/validate', (req, res) => {
  const { username, email, password } = req.body;

  const errors = {};

  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    errors.username = 'Uživatelské jméno může obsahovat pouze alfanumerické znaky.';
  } else if (users.some(user => user.username === username)) {
    errors.username = 'Toto uživatelské jméno je již používáno.';
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'Email není ve správném formátu (např. aaa@bbb.ccc).';
  } else if (users.some(user => user.email === email)) {
    errors.email = 'Tento email je již používán.';
  }

  const passwordErrors = [];
  if (password.length < 8) {
    passwordErrors.push('Heslo musí být alespoň 8 znaků dlouhé.');
  }
  if (!/.*[a-z].*/.test(password)) {
    passwordErrors.push('Heslo musí obsahovat alespoň jedno malé písmeno.');
  }
  if (!/.*[A-Z].*/.test(password)) {
    passwordErrors.push('Heslo musí obsahovat alespoň jedno velké písmeno.');
  }
  if (!/.*\d.*/.test(password)) {
    passwordErrors.push('Heslo musí obsahovat alespoň jedno číslo.');
  }
  if (!/.*[!@#$%^&*(),.?":{}|<>].*/.test(password)) {
    passwordErrors.push('Heslo musí obsahovat alespoň jeden speciální znak.');
  }
  if (password.length > 16) {
    passwordErrors.length = 0;
  }
  if (passwordErrors.length) {
    errors.password = passwordErrors.join(' ');
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  users.push({ username, email });

  res.status(200).json({ message: 'Registrace proběhla úspěšně!' });
});

app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});
