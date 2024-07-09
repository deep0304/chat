require("dotenv").config();
const mongoose = require("mongoose");
const connectionString = process.env.CONNECTIONSTRING;
async function run() {
  try {
    await mongoose.connect(connectionString, {
      dbName: "ChatApp",
    });
    console.log("connected successfully");
  } catch (e) {
    console.log("Error: ", e);
  }
}
run();

// const {MongoClient, ServerApiVersion} = require("mongodb");
// const connectionString = process.env.CONNECTIONSTRING;
// //creating the mongo client
// console.log(connectionString);
// const client = new MongoClient(connectionString,
//     {
//         serverApi: {
//           version: ServerApiVersion.v1,
//           strict: true,
//           deprecationErrors: true,
//         }
//     }
// );
// async function run() {
//     try{
//     //connect
//     await client.connect();
//     await client.db("admin").command({ping:1});
//     console.log("pinged the deployment.");
//     //const users = db.collectionName.find("Users");
// }
//     finally{
//         await client.close();
//     }

// }
// run().catch(console.dir);
