const { deleteFolderInCollection } = require("../../wasabi");
const { ObjectId } = require("mongodb");

const create = async (collection, data) => {
  const { connectToDatabase } = require("../../mongodb");
  const { db } = await connectToDatabase();
  const res = await db.collection(collection).insertOne(data);
  return res;
};

const getAll = async (collection) => {
  const { connectToDatabase } = require("../../mongodb");
  const { db } = await connectToDatabase();
  return db.collection(collection).find({}).toArray();
};

// Accept a query object (e.g. { phone: "+57..." } or { _id: "..." })
// Maps `phone` => `info.phone` so GET ?phone=... works with nested storage.
const get = async (collection, query = {}) => {
  const { connectToDatabase } = require("../../mongodb");
  const { db } = await connectToDatabase();

  // If query is a string/number (legacy), fall back to return all
  if (!query || typeof query !== "object") {
    return db.collection(collection).find({}).toArray();
  }

  const filter = {};

  // support _id query
  if (query._id) {
    try {
      filter._id = ObjectId(query._id);
    } catch (e) {
      // invalid id string -> no results
      return [];
    }
  }

  // convenience: query ?phone=... -> map to info.phone
  if (query.phone) {
    filter["info.phone"] = query.phone;
  }

  // copy other direct keys (shallow)
  Object.keys(query).forEach((k) => {
    if (k === "_id" || k === "phone") return;
    // handle numeric strings for offset/limit if you later support them
    filter[k] = query[k];
  });

  return db.collection(collection).find(filter).toArray();
};

// remove: accept either id string or { id: '...' } to match route usage
const remove = async (collection, idOrObj, wasabiId = undefined) => {
  const { connectToDatabase } = require("../../mongodb");
  const { db } = await connectToDatabase();

  let _id = idOrObj;
  if (idOrObj && typeof idOrObj === "object" && idOrObj.id) {
    _id = idOrObj.id;
  }

  if (!_id) {
    throw new Error("missing id for remove");
  }

  wasabiId && (await deleteFolderInCollection(collection, wasabiId));
  return db.collection(collection).deleteOne({ _id: ObjectId(_id) });
};

// Patch/update a document by _id. data is the partial object to $set.
const update = async (collection, id, data) => {
  const { connectToDatabase } = require("../../mongodb");
  const { db } = await connectToDatabase();
  if (!id) throw new Error("missing id for update");
  if (!data || Object.keys(data).length === 0)
    throw new Error("missing data for update");

  const res = await db
    .collection(collection)
    .updateOne({ _id: new ObjectId(id) }, { $set: data }, { upsert: false });
  return res;
};

module.exports = {
  create,
  getAll,
  get,
  remove,
  update,
};
