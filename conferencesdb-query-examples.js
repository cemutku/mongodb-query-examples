const mongoClient = require('./mongoClient');
const assert = require('assert');

const Conference = require('./models/Conference');
const Session = require('./models/Session');
const conferenceData = require('./data/conferences.json');
const conferenceTestData = require('./data/test_conferences.json');
const attendees = require('./data/attendees.json');
const sessionData = require('./data/sessions.json');
const Attendee = require('./models/Attendee');

async function main() {
  try {
    await mongoClient.connect();
    const db = mongoClient.getDb();
    const conference = new Conference(db);
    const session = new Session(db);
    const attendee = new Attendee(db);

    // Test Data insert

    const conferenceTestDataResults = await conference.loadData(
      conferenceTestData
    );
    assert.strictEqual(
      conferenceTestData.length,
      conferenceTestDataResults.insertedCount
    );

    const conferencesResults = await conference.loadData(conferenceData);
    assert.strictEqual(conferenceData.length, conferencesResults.insertedCount);

    const sessionResults = await session.loadData(sessionData);
    assert.strictEqual(sessionData.length, sessionResults.insertedCount);

    const attendeesResults = await attendee.loadData(attendees);
    assert.strictEqual(attendees.length, attendeesResults.insertedCount);

    // Find operations

    const allConferenceData = await conference.get();
    // assert.equal(conferenceData.length, allConferenceData.length);

    const filteredData = await conference.get({
      title: allConferenceData[2].title,
    });
    assert.deepStrictEqual(filteredData[0], allConferenceData[2]);

    const sortedData = await conference.sortBySelectedField('ticket_cost');
    assert.strictEqual(undefined, sortedData[0]._id);
    // console.log(sortedData);

    const abaloneRooms = await session.findSessionsByRoom('Abalone');
    assert.strictEqual('Abalone', abaloneRooms[2].room);

    const sessionsWithoutSessionType = await session.findSessionsWithoutSessionType();
    assert.strictEqual(sessionsWithoutSessionType[0].session_type, undefined);
    // console.log(sessionsWithoutSessionType);

    const fullSessions = await session.findFullSessions();
    assert.strictEqual(fullSessions[0].seats, fullSessions[0].registered);
    // console.log(fullSessions);

    const registeredIsLessThanSeats = await session.findRegisteredIsLessThanSeats();
    // console.log(registeredIsLessThanSeats);
    assert.notStrictEqual(
      registeredIsLessThanSeats[0].seats,
      registeredIsLessThanSeats[0].registered
    );

    const conferencesWithSpecificRatingRange = await conference.getConferencesWithSpecificRatingRange();
    // console.log(conferencesWithSpecificRatingRange);
    assert.strictEqual(conferencesWithSpecificRatingRange.length, 4);

    // Update operations

    const updateConferenceTicketCostResult = await conference.updateConferenceTicketCost(
      'mongoconf',
      600
    );
    // console.log(updateConferenceTicketCostResult);

    const updatedMongoConference = await conference.getByWithoutObjectId(
      'mongoconf'
    );
    // console.log(updatedMongoConference);
    assert.strictEqual(updatedMongoConference.ticket_cost, 600);

    const dataconfBeforeIncrement = await conference.getByWithoutObjectId(
      'dataconf'
    );
    const updateAttendeeCountResult = await conference.updateAttendeeCount(
      'dataconf',
      25
    );
    // console.log(updateAttendeeCountResult);
    const dataconfAfterIncrement = await conference.getByWithoutObjectId(
      'dataconf'
    );
    assert.strictEqual(
      dataconfBeforeIncrement.attendees + 25,
      dataconfAfterIncrement.attendees
    );

    const updateAttendeeCountWrongResult = await conference.updateAttendeeCountWrong(
      'dataconf',
      25
    );
    // console.log(updateAttendeeCountWrongResult);
    const conferenceWithWrongField = await conference.getByWithoutObjectId(
      'dataconf'
    );

    // console.log(conferenceWithWrongField);
    assert(conferenceWithWrongField.attendee_count);

    const unsetFieldResult = await conference.unsetField(
      'dataconf',
      'attendee_count'
    );

    const conferenceAfterUnset = await conference.getByWithoutObjectId(
      'dataconf'
    );
    assert.strictEqual(conferenceAfterUnset.attendee_count, undefined);
    // console.log(conferenceAfterUnset);

    const updateConferencesWithLowRatingResult = await conference.updateConferencesWithLowRating();
    // console.log(updateConferencesWithLowRatingResult);

    const addNewRatingToConferencesResult = await conference.addNewRatingToConferences(
      'mongoconf',
      10
    );
    // console.log(addNewRatingToConferencesResult);

    const addNewRatingsToConferencesResult = await conference.addNewRatingsToConferences(
      'mongoconf',
      [7, 9, 10]
    );
    // console.log(addNewRatingsToConferencesResult);

    // Upsert operations

    const upsertAttendeeCountResult = await conference.upsertAttendeeCount();
    // console.log(upsertAttendeeCountResult);

    const upsertTicketCostResult = await conference.upsertTicketCost();
    // console.log(upsertTicketCostResult);

    await conference.upsertWithSetOnInsertOption();
    // console.log(upsertWithSetOnInsertOptionResult);

    const updateTicketCostAndAttendeeCountResult = await conference.updateTicketCostAndAttendeeCount(
      'python01',
      700,
      25
    );

    const upsertWithSetOnInsertOptionResult = await conference.upsertWithSetOnInsertOption();
    const upsertedConference = await conference.getByWithoutObjectId(
      'python01'
    );
    assert.strictEqual(upsertedConference.attendee_count, 25);
    await conference.removeWithoutObjectId('python01');

    // const updatePoorRatingsResult = await conference.updatePoorRatings();
    // console.log(updatePoorRatingsResult);

    // Bulk Write

    const bulkWriteResult = await conference.bulkWrite();
    // console.log(bulkWriteResult);

    // Delete operations
    const deleteConferenceWithNegativeTicketCostResult = await conference.deleteConferenceWithNegativeTicketCost();
    // console.log(deleteConferenceWithNegativeTicketCostResult);

    const deleteConferencesWithNegativeTicketCostResult = await conference.deleteConferencesWithNegativeTicketCost();
    // console.log(deleteConferencesWithNegativeTicketCostResult);

    const deleteSessionsResult = await session.deleteSessions(
      'javascript',
      'Barracuda'
    );
    // console.log(deleteSessionsResult);

    const javascriptBarracudaSessions = await session.get({
      $and: [{ topic: { $eq: 'javascript' } }, { room: { $eq: 'Barracuda' } }],
    });
    assert.strictEqual(javascriptBarracudaSessions.length, 0);

    const deleteAttendeesWithThreeOrMoreCapitalLettersResult = await attendee.deleteAttendeesWithThreeOrMoreCapitalLetters();
    // console.log(deleteAttendeesWithThreeOrMoreCapitalLettersResult);

    const deleteFullWorkshopsResult = await session.deleteFullWorkshops();
    // console.log(deleteFullWorkshopsResult);

    const fullSessionsAfterDelete = await session.findFullSessions();
    assert.strictEqual(fullSessionsAfterDelete.length, 0);
  } catch (error) {
    console.log(error);
  } finally {
    await mongoClient.dropDb();
    await mongoClient.close();
  }
}

main();
