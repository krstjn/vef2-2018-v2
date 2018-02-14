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

async function getData() {
  const query = 'SELECT * FROM info';

  const client = new Client({ connectionString });
  await client.connect();
  const results = await client.query(query);
  await client.end();

  return results.rows;
}

router.post('/', async (req, res) => {
  const data = req.body;
  const errors = [];

  // Þetta er bara validation! Ekki sanitization
  if (data.name === '') {
    errors.push('Nafn má ekki vera tómt');
  }

  if (data.email === '' || data.email.indexOf('@') < 0) {
    errors.push('Netfang má ekki vera tómt');
    errors.push('Netfang verður að vera netfang');
    
  }

  if (data.ssn === '' || !/^[0-9]{6}-?[0-9]{4}$/.test(data.ssn)) {
    errors.push('Kennitala má ekki vera tóm');
    errors.push('Verður að vera kennitala');
    
  }

  if (data.count === '' || !/^[1-9][0-9]*$/) {
    errors.push('Þarf að vera heiltala stærri en 0');
  }
  const loggedIn = req.isAuthenticated();

  if (errors.length > 0) {
    return res.render('form', {
      errors,
      data,
    });
  }

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

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
  console.log('ensure logged in');
    
    return next();
  }

  return res.redirect('/login');
}
router.get('/admin', ensureLoggedIn, async (req, res) => {
  const data = await getData();
  res.render('admin', { data });
});

router.get('/', form);

module.exports = router;
