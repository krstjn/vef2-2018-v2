const express = require('express');
const users = require('./users');
const passport = require('passport');
const { Strategy } = require('passport-local');

const router = express.Router();

/* todo */
const { Client } = require('pg');

const connectionString = 'postgres://notandi:123@localhost/v2';


async function select() {
  const query = 'SELECT * FROM info';

  const client = new Client({ connectionString });
  await client.connect();
  const results = await client.query(query);
  await client.end();

  return results.rows;
}


// select().catch(e => console.error(e));


module.exports = router;
