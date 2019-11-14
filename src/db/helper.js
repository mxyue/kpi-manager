
class Helper {
  static BuildBulkUpdateOne(queryDoc, setDoc, upsert = false) {
    return {
      updateOne: {
        filter: queryDoc,
        update: setDoc,
        upsert
      }
    }
  }
  
  static BuildBulkInsertOne(insertDoc) {
    return {insertOne: {document: insertDoc}}
  }
}

module.exports = Helper 