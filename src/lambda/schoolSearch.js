const { MongoClient } = require('mongodb');
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
// const searchProjection = {
//     '_id': true,
//     'facility': true,
//     'operation_name': true,
//     'corp_name': true,
//     'address.city': true
// }

// GET /api/schools/search
export function handler(event, context, callback) {

  // Connects to MongoDB
  MongoClient.connect(DB_URL, (err, connection) => {

    // Connection error handling
    if (err) return errorResponse(callback, err);

    // DB helpers
    const db = connection.db(DB_NAME);
    const schoolCollection = db.collection('schools'); // TODO - constantize 'schools'

    // Handles default value query
    const reqQuery = event.queryStringParameters || {}

    // Pulls pagination parameters
    const { page, per_page, skip } = handlePagination(reqQuery)

    // Handles user queries
    let query = {}
    let searchQuery = reqQuery.q

    // // Regex matching for text search
    // let matchQuery = [
    //     { facility: new RegExp(searchQuery, 'i') },
    //     { operation_name: new RegExp(searchQuery, 'i') },
    //     { corp_name: new RegExp(searchQuery, 'i') }
    // ]

    // // Builds query
    // if (reqQuery.city) {
    //     query['$and'] = [
    //         { '$or': matchQuery },
    //         { 'address.city': reqQuery.city }
    //     ]
    // } else {
    //     query['$and'] = [
    //         { '$or': matchQuery }
    //     ]
    // }

    // Gets count of all schools (should be cached, or ideally done in a single query)
    schoolCollection.count(query)
    .then((count) => {


        // Paginates the school collection
        schoolCollection.find(query)
        // .project(searchProjection)
        // .sort({ operation_name: 1 })
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
