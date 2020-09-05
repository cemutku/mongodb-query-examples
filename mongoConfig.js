const connectionValues = {
  username: 'mongouser',
  pwd: 'mongopwd',
  url: 'localhost:27017',
  database: 'sampledb',
};

const uri = `mongodb://${connectionValues.username}:${connectionValues.pwd}@${connectionValues.url}`;

module.exports = { connectionValues, uri };
