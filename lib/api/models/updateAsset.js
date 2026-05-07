import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../mongodb";
export async function updateAsset(req, res, collectionName, fields) {
  const asset = req.assetsState[collectionName].find(
    (asset) => asset._id == req.body._id,
  );
  if (req.method === "PUT") {
    try {
      const { db } = await connectToDatabase();
      const issuer = req.session.user;
      const edition = {
        utc: new Date(),
        by: new ObjectId(issuer._id),
      };
      const result = await db.collection(collectionName).updateOne(
        {
          _id: ObjectId(req.body._id),
        },
        {
          $set: fields,
          $push: {
            edition,
          },
        },
      );
      if (!result.acknowledged) {
        return res.status(400).json({
          status: "failure",
          message: "Update operation was not acknowledged",
        });
      } else {
        for (const field in fields) {
          asset[field] = req.body[field];
        }
        !asset.edition && (asset.edition = []);
        asset.edition.push(JSON.parse(JSON.stringify(edition)));
        res.status(200).json({
          status: "success",
          data: result,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "failure",
        message: "An error occurred while updating the asset",
        error: error.message,
      });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  asset.editing = false;
}
