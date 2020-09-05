const CommonModel = require('./CommonModel');

class Attendee extends CommonModel {
  constructor(db) {
    super(db, 'attendees');
  }

  async deleteAttendeesWithThreeOrMoreCapitalLetters() {
    try {
      const result = await this.collection.deleteMany({
        state: { $regex: /[A-Z]{3,}/, $options: 'i' },
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Attendee;
