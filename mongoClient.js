const { MongoClient } = require('mongodb');
const { uri, connectionValues } = require('./mongoConfig');

function mongoClient() {
  function getDb() {
    return this.db;
  }

  async function connect() {
    this.client = await createClient();
    this.db = this.client.db(connectionValues.database);
  }

  async function close() {
    if (this.client) {
      await this.client.close();
      console.log('connection closed');
    }
  }

  async function dropDb() {
    if (this.db) {
      this.db.dropDatabase();
    }
  }

  function createClient(userOptions) {
    return new Promise(async (resolve, reject) => {
      const options = Object.assign(
        {},
        { useUnifiedTopology: true },
        userOptions
      );

      try {
        const client = await MongoClient.connect(uri, options);
        console.log('connected');
        resolve(client);
      } catch (error) {
        reject(error);
      }
    });
  }

  return { connect, getDb, close, dropDb };
}

module.exports = mongoClient();
