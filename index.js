const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// use all the middleware
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.AUTH_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden" });
    }
    // console.log("decoded", decoded);
    req.decoded = decoded;
    next();
  });
}

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
    app.get("/volantear", verifyJWT, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const email = req.query.email;
      console.log(decodedEmail)
      if (email === decodedEmail) {
        const query = { email: email };
        const cursor = addVolantear.find(query);
        const result = await cursor.toArray();
        res.send(result);
      } else {
        res.status(403).send({message : "Forbidden"})
      }
    });

    app.delete('/volantear/:id', async(req,res) => {
        const id = req.params.id ;
        const query = {_id : ObjectId(id)};
        const result = await addVolantear.deleteOne(query);
        res.send(result);
    })

    // CREATE AUTH TOKEN
    app.post("/token", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.AUTH_TOKEN, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });

    // delete a volantear
    app.delete("/allvolantear/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await addVolantear.deleteOne(query);
      res.send(result);
    });
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
