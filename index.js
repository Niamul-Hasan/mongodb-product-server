const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;


app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Heroku is running')
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

        //to delete one product from database
        app.delete("/products/:productId", async (req, res) => {
            const id = req.params.productId;
            const query = { _id: ObjectId(id) };
            const deletedProduct = await productCollection.deleteOne(query);
            res.send(deletedProduct);
        })

        //to update one product from database
        // app.put("/products/:productId", async (req, res) => {
        //     const id = req.params.productId;
        //     const query = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const Data = req.body;
        //     const updatedProduct = await productCollection.updateOne(query, Data, options);
        //     res.send(updatedProduct);
        // })
        app.get('/hero', (req, res) => {
            res.send('Heroku is in a meeting with hero')
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