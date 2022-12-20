const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// use all the middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.nrvwj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// console.log(uri)

async function run() {
  try {
    const volantears = client.db("Volantears_Network");
    const volantearsCollection = volantears.collection("volantears_service");
    const addVolantear = volantears.collection("Add_Volantear");

    // get all the collection the user interface
    app.get("/volantearsService", async (req, res) => {
      const query = {};
      const cursor = volantearsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // add an event from the user interface
    app.post("/addevent", async (req, res) => {
      const newEvent = req.body;
      const result = await volantearsCollection.insertOne(newEvent);
      res.send(result);
    });

    // ADD a Volantear
    app.post("/addvolantear", async (req, res) => {
      const newVolantear = req.body;
      const result = await addVolantear.insertOne(newVolantear);
      res.send(result);
    });

    // see all the volantear
    app.get("/allvolantear", async (req, res) => {
      const query = {};
      const cursor = addVolantear.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // see a volantear by filtering email
    app.get("/volantear", async (req, res) => {
        const email = req.query.email;
        const query = {email : email};
        const cursor = addVolantear.find(query);
        const result = await cursor.toArray();
        res.send(result);
      });

    // delete a volantear 
    app.delete('/allvolantear/:id',async(req,res) => {
       const id = req.params.id ;
       const query = {_id : ObjectId(id)};
       const result = await addVolantear.deleteOne(query);
       res.send(result);
    })
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Developer Sifat How Are you");
});

app.listen(port, () => {
  console.log(`Listening to the ${port} succesfully`);
});
