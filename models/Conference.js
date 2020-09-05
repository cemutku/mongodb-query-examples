const CommonModel = require('./CommonModel');

class Conference extends CommonModel {
  constructor(db) {
    super(db, 'conferences');
  }

  async sortBySelectedField(sortField) {
    return await this.collection
      .find({})
      .project({ title: 1, [sortField]: 1, _id: 0 })
      .sort({ [sortField]: -1 })
      .toArray();
  }

  async getConferencesWithSpecificRatingRange() {
    try {
      const results = await this.collection
        .find({ ratings: { $elemMatch: { $gte: 3, $lte: 8 } } })
        .toArray();
      return results;
    } catch (error) {
      console.log(error);
    }
  }

  async updateConferenceTicketCost(conferenceId, ticketCost) {
    try {
      const result = await this.collection.updateOne(
        { _id: conferenceId },
        { $set: { ticket_cost: ticketCost } }
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async updateAttendeeCount(conferenceId, attendeeCount) {
    try {
      const result = await this.collection.updateOne(
        { _id: conferenceId },
        { $inc: { attendees: attendeeCount } }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async updateAttendeeCountWrong(conferenceId, attendeeCount) {
    try {
      const result = await this.collection.updateOne(
        { _id: conferenceId },
        { $inc: { attendee_count: attendeeCount } }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async unsetField(conferenceId, fieldName) {
    try {
      const result = await this.collection.updateOne(
        { _id: conferenceId },
        { $unset: { [fieldName]: '' } }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async updateConferencesWithLowRating() {
    try {
      const result = this.collection.updateMany(
        {},
        { $pull: { ratings: { $lte: 2 } } }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async addNewRatingToConferences(conferenceId, rating) {
    try {
      const result = await this.collection.updateOne(
        { _id: conferenceId },
        { $push: { ratings: rating } }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async addNewRatingsToConferences(conferenceId, ratingArray) {
    try {
      const result = await this.collection.updateOne(
        { _id: conferenceId },
        { $push: { ratings: { $each: ratingArray } } }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async upsertAttendeeCount() {
    try {
      const result = await this.collection.updateMany(
        { attendee_count: { $lt: 350 } },
        { $set: { ticket_cost: 300 } },
        { upsert: true }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async upsertTicketCost() {
    try {
      const result = await this.collection.updateOne(
        { _id: 'javascript01' },
        { $set: { ticket_cost: 700 }, $inc: { attendee_count: 25 } },
        { upsert: true }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  // setOnInsert works only if an upsert operation exsits. If "python01" exist setOnInsert does not set the attendee_count 0
  async upsertWithSetOnInsertOption() {
    try {
      const result = await this.collection.updateOne(
        { _id: 'python01' },
        { $set: { ticket_cost: 500 }, $setOnInsert: { attendee_count: 0 } },
        { upsert: true }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async updateTicketCostAndAttendeeCount(
    conferenceId,
    ticketCost,
    attendeeCount
  ) {
    try {
      const result = await this.collection.updateOne(
        { _id: conferenceId },
        {
          $set: { ticket_cost: ticketCost },
          $inc: { attendee_count: attendeeCount },
        }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async bulkWrite() {
    try {
      const result = await this.collection.bulkWrite([
        {
          insertOne: {
            document: {
              title: 'MongoDB',
              ticket_cost: 400,
              attendees: 200,
            },
          },
        },
        {
          insertOne: {
            document: {
              _id: 2,
              title: 'JS',
              ticket_cost: 250,
              attendees: 50,
            },
          },
        },
        {
          updateOne: {
            filter: { _id: 2 },
            update: { $inc: { attendees: 25 } },
          },
        },
        {
          deleteOne: {
            filter: { ticket_cost: { $gte: 325 } },
          },
        },
      ]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteConferenceWithNegativeTicketCost() {
    try {
      const result = await this.collection.deleteOne({
        ticket_cost: { $lt: 0 },
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteConferencesWithNegativeTicketCost() {
    try {
      const result = await this.collection.deleteMany({
        ticket_cost: { $lt: 0 },
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  // Filtered positional operator example $
  async updatePoorRatings() {
    try {
      const result = await this.collection.updateOne(
        {
          _id: { $in: ['dataconf', 'mongoconf'] },
        },
        {
          $inc: { 'ratings.$[poorratings]': 1 },
        },
        {
          arrayFilters: [{ poorratings: { $lte: 3 } }],
        }
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Conference;
