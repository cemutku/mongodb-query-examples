const CommonModel = require('./CommonModel');

class User extends CommonModel {
  constructor(db) {
    super(db, 'users');
  }

  async getPostsWithUser() {
    try {
      const results = await this.collection
        .aggregate([
          {
            $lookup: {
              from: 'posts',
              localField: 'id',
              foreignField: 'userId',
              as: 'post_collection',
            },
          },
        ])
        .toArray();

      return results;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = User;
