const express = require('express');

const router = express.Router();

/* todo */
const { Client } = require('pg');

const connectionString = 'postgres://notandi:123@localhost/v2';

const client = new Client({ connectionString });
client.connect();

async function select() {
  try {
    const res = await client.query('SELECT * FROM info');
    console.log(res.rows);
  } catch (e) {
    console.error('Error selecting', e);
  }
  await client.end();
}

select().catch(e => console.error(e));
module.exports = router;
