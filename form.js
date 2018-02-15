const express = require('express');
const xss = require('xss');
const router = express.Router();

function form(req, res) {
  const data = {};
  if (req.isAuthenticated()) {
    res.render('form', { data, loggedIn: req.user.name });
  } else {
    res.render('form', { data });
  }
}

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://notandi:123@localhost/v2';

// const results = [];

async function insertData(data) {
  const query = 'INSERT INTO info(nafn, netfang, ssn, fjoldi) VALUES ($1, $2, $3, $4)';
  const values = [data.name, data.email, data.ssn, data.count];

  const client = new Client({ connectionString });
  await client.connect();
  await client.query(query, values);
  await client.end();
}

router.post('/', async (req, res) => {
  const {
    name = '',
    email = '',
    ssn = '',
    count = 0,
  } = req.body;

  const errors = [];

  if (name === '') {
    errors.push('Nafn má ekki vera tómt');
  }

  if (email === '') {
    errors.push('Netfang má ekki vera tómt');
  }

  if (email.indexOf('@') < 0) {
    errors.push('Netfang verður að vera netfang');
  }

  if (ssn === '') {
    errors.push('Kennitala má ekki vera tóm');
  }

  if (!/^[0-9]{6}-?[0-9]{4}$/.test(ssn)) {
    errors.push('Verður að vera kennitala');
  }

  if (count === '' || !/^[1-9][0-9]*$/) {
    errors.push('Þarf að vera heiltala stærri en 0');
  }
  console.log(errors);
  const loggedIn = req.isAuthenticated();

  if (errors.length > 0) {
    return res.render('form', {
      errors,
      data: req.body,
      loggedIn,
    });
  }
  const data = {
    name: xss(name),
    email: xss(email),
    ssn: xss(ssn),
    count: xss(count),
  };

  await insertData(data);

  res.redirect('/thanks');
});

router.get('/thanks', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('thanks', { loggedIn: req.user.name });
  } else {
    res.render('thanks');
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/', form);

module.exports = router;
