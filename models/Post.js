const CommonModel = require('./CommonModel');

class Post extends CommonModel {
  constructor(db) {
    super(db, 'posts');
  }
}

module.exports = Post;
