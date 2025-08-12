const { Client } = require('@elastic/elasticsearch');
const config = require('../config');

const client = new Client({ node: config.esUrl });

async function ensureIndex(indexName, mapping = {}) {
  const exists = await client.indices.exists({ index: indexName });
  if (!exists) {
    await client.indices.create({ index: indexName, body: mapping });
  }
}

module.exports = { client, ensureIndex };
