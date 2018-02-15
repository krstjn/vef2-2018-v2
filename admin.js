const express = require('express');
const json2csv = require('json2csv');

const router = express.Router();

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://notandi:123@localhost/v2';

async function getData() {
  const query = 'SELECT * FROM info';

  const client = new Client({ connectionString });
  await client.connect();
  const results = await client.query(query);
  await client.end();

  return results.rows;
}

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

router.get('/download', ensureLoggedIn, async (req, res) => {
  const filename = 'test.csv';
  const data = await getData();
  const fields = ['dagsetning', 'nafn', 'netfang', 'fjoldi', 'ssn'];
  const csv = json2csv({ data, fields, del: ';' });
  res.set(
    'Content-Disposition',
    `attachment; filename="${filename}"`,
  );
  res.send(csv);
});

router.get('/', ensureLoggedIn, async (req, res) => {
  const data = await getData();
  res.render('admin', { data, title: 'Admin' });
});

module.exports = router;
