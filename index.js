const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;


app.use(express.json());
app.use(cors());



//user:mongoUser
//pass: r7GtDNNpFihatoXv





app.get('/', (req, res) => {
    res.send('Hello from root')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vqrww.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const productCollection = client.db("PracticeProduct").collection("product");
        console.log('this is from mongo')

        //to load all data from db
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
        //to add one product in the db
        app.post("/products", async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     console.log('this is from mongo')
//     // perform actions on the collection object
//     // client.close();
// });



app.listen(port, () => {
    console.log(`This server app listening on port ${port}`)
})