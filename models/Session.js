const CommonModel = require('./CommonModel');

class Session extends CommonModel {
  constructor(db) {
    super(db, 'sessions');
  }

  async findSessionsByRoom(roomValue) {
    return await this.collection.find({ room: roomValue }).toArray();
  }

  async findSessionsWithoutSessionType() {
    try {
      const results = await this.collection
        .find({ session_type: { $exists: false } })
        .toArray();

      return results;
    } catch (error) {
      console.log(error);
    }
  }

  async findFullSessions() {
    try {
      const results = await this.collection
        .find({
          $and: [
            { seats: { $exists: true } },
            { registered: { $exists: true } },
            { $expr: { $eq: ['$seats', '$registered'] } },
          ],
        })
        .project({ _id: 0 })
        .toArray();
      return results;
    } catch (error) {
      console.log(error);
    }
  }

  async findRegisteredIsLessThanSeats() {
    try {
      const results = await this.collection
        .find({
          $expr: { $lt: ['$registered', '$seats'] },
          $comment: 'select workshops that still have an available seat',
        })
        .toArray();
      return results;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteSessions(topic, room) {
    try {
      const result = await this.collection.deleteMany({
        $and: [{ topic: { $eq: topic } }, { room: { $eq: room } }],
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteFullWorkshops() {
    try {
      // Two non-existent fields are equal value!
      // const result = await this.collection.deleteMany({$expr: {$gte: ["$registered", "$seats"]}})
      const result = await this.collection.deleteMany({
        $and: [
          { session_type: { $eq: 'workshop' } },
          { $expr: { $gte: ['$registered', '$seats'] } },
        ],
        $comment: 'Remove all workshops where there are no available seats',
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Session;
