const mongoClient = require('./mongoClient');
const assert = require('assert');

const Post = require('./models/Post');
const User = require('./models/User');
const postData = require('./data/posts.json');
const userData = require('./data/users.json');

async function main() {
  try {
    await mongoClient.connect();
    const db = mongoClient.getDb();
    const post = new Post(db);

    const results = await post.loadData(postData);
    assert.equal(postData.length, results.insertedCount);

    const allData = await post.get();
    assert.equal(postData.length, allData.length);

    const filteredData = await post.get({ title: allData[5].title });
    assert.deepEqual(filteredData[0], allData[5]);

    const limitedData = await post.get({}, 5);
    assert.equal(limitedData.length, 5);

    const id = allData[4]._id.toString();
    const itemById = await post.getById(id);
    assert.deepEqual(itemById, allData[4]);

    const newItem = {
      userId: 500,
      id: 500,
      title: 'Test title',
      body: 'Test body',
    };

    const addedItem = await post.add(newItem);
    assert(addedItem._id);

    const addedItemQuery = await post.getById(addedItem._id);
    assert.deepEqual(addedItemQuery, newItem);

    const itemToUpdate = {
      title: 'Updated Test title',
      body: 'Updated Test body',
    };

    const updatedItem = await post.update(addedItem._id, itemToUpdate);
    assert.equal(updatedItem.title, 'Updated Test title');

    const newAddedItemQuery = await post.getById(addedItem._id);
    assert.equal(newAddedItemQuery.title, 'Updated Test title');

    const removed = await post.remove(addedItem._id);
    assert(removed);
    assert(removed.deletedCount, 1);

    const deletedItem = await post.getById(addedItem._id);
    assert.equal(deletedItem, null);

    const user = new User(db);
    const userDataResults = await user.loadData(userData);
    assert.equal(userData.length, userDataResults.insertedCount);

    const userWithPosts = await user.getPostsWithUser();
    assert.equal(userWithPosts[0].post_collection.length, 10);
  } catch (error) {
    console.log(error);
  } finally {
    await mongoClient.dropDb();
    await mongoClient.close();
  }
}

main();
