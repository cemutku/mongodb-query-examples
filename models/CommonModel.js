const { ObjectID } = require('mongodb');

class CommonModel {
  constructor(db, collection) {
    this.collection = db.collection(collection);
  }

  async get(query, limit) {
    try {
      let items = this.collection.find(query);

      if (limit > 0) {
        items.limit(limit);
      }

      return await items.toArray();
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      return await this.collection.findOne({ _id: ObjectID(id) });
    } catch (error) {
      console.log(error);
    }
  }

  async getByWithoutObjectId(id) {
    try {
      return await this.collection.findOne({ _id: id });
    } catch (error) {
      console.log(error);
    }
  }

  async add(item) {
    try {
      const addedItem = await this.collection.insertOne(item);
      return addedItem.ops[0];
    } catch (error) {
      console.log(error);
    }
  }

  async update(id, newItem) {
    try {
      const updatedItem = await this.collection.findOneAndReplace(
        { _id: ObjectID(id) },
        newItem,
        {
          returnOriginal: false,
        }
      );
      return updatedItem.value;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id) {
    try {
      return await this.collection.deleteOne({ _id: ObjectID(id) });
    } catch (error) {
      console.log(error);
    }
  }

  async removeWithoutObjectId(id) {
    try {
      return await this.collection.deleteOne({ _id: id });
    } catch (error) {
      console.log(error);
    }
  }

  async loadData(data) {
    try {
      return await this.collection.insertMany(data);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = CommonModel;
