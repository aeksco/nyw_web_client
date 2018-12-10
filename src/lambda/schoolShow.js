const { MongoClient, ObjectId } = require('mongodb');
const DB_URL = process.env.DB;
const DB_NAME = process.env.DB_NAME;

// // // //

function errorResponse(callback, err) {
  console.error(err);

  callback(null, {
    statusCode: 500,
    body: JSON.stringify({ error: err })
  })
}

function successResponse(callback, res) {
  console.log('Saved new page request. Current count:', res.value.requests);

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(res)
  });
}

// // // //

// GET /api/schools/{schoolId}
export function handler(event, context, callback) {
  MongoClient.connect(DB_URL, (err, connection) => {
    if (err) return errorResponse(callback, err);

    const db = connection.db(DB_NAME);
    const schoolCollection = db.collection('schools');

    // Isolates schoolID parameter
    // TODO - handle missing schoolId parameter
    const schoolId = event.queryStringParameters.id

    // Finds ONE school
    schoolCollection.findOne({ _id: ObjectId(schoolId) }, (err, result) => {
      if (err) return errorResponse(callback, err);

      connection.close();

      callback(null, {
        statusCode: 200,
        body: JSON.stringify(result)
      });

    })

  });
}
