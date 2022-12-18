const express = require("express");
const app = express();
const port = process.env.PORT || 5000 ;
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()




// use all the middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.nrvwj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri)


async function run () {
    try {
        const volantears = client.db("Volantears_Network");
        const volantearsCollection = volantears.collection("volantears_service");

        // get all the collection the user interface
        app.get('/volantearsService', async(req,res) => {
            const query = {};
            const cursor = volantearsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
    } finally {

    }
};

run().catch(console.dir)




app.get("/", (req,res) => {
    res.send("Hello Developer Sifat How Are you")
})

app.listen(port, () => {
    console.log(`Listening to the ${port} succesfully`);
})