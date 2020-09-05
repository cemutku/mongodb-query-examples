# MongoDB Query Examples

The official MongoDB Node.js driver and mongo docker image is used for this project.

- For MongoDB instance, use the `docker run -d --rm -p 27017:27017 --name mongodb -e MONGO_INITDB_ROOT_USERNAME=mongouser -e MONGO_INITDB_ROOT_PASSWORD=mongopwd mongo` docker command.

- Use below commands for testing and you can modify queries and console.logs
  - `node conferencesdb-query-examples.js`
  - `node postsdb-query-examples.js`
