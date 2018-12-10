const { MongoClient } = require('mongodb');
const DB_URL = process.env.DB;
const DB_NAME = process.env.DB_NAME;

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

// Defines default pagination options
function handlePagination (query) {
    let page = Number(query.page) || 1;
    page = Math.max(page - 1, 0)
    let per_page = Number(query.per_page) || 10;
    let skip = per_page * page;
    return { page, per_page, skip }
}

// // // //

// Defines the attributes returned when searching
// SEE https://docs.mongodb.com/manual/reference/method/db.collection.find/#find-projection
const searchProjection = {
    '_id': true
}

// GET /api/schools
export function handler(event, context, callback) {

  // Connects to MongoDB
  MongoClient.connect(DB_URL, { useNewUrlParser: true }, (err, connection) => {

    // Connection error handling
    if (err) return errorResponse(callback, err);

    // DB helpers
    const db = connection.db(DB_NAME);
    const schoolCollection = db.collection('schools'); // TODO - constantize 'schools'

    // Pulls pagination parameters
    const { page, per_page, skip } = handlePagination(event.queryStringParameters || {})

    // Gets count of all schools (should be cached, or ideally done in a single query)
    schoolCollection.count()
    .then((count) => {

        // Paginates the school collection
        schoolCollection.find({})
        // .project(searchProjection)
        .limit(per_page)
        .skip(skip)
        .toArray((err, items) => {

          // Handles find query error
          if (err) return errorResponse(callback, err);

          // Closes the DB connection
          connection.close();

          // Sends response to client
          callback(null, {
            statusCode: 200,
            body: JSON.stringify({ items, page, per_page, count })
          });

        })

    })

  });
}
