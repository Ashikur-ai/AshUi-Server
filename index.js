const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware  
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bpilnp1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server    (optional starting in v4.7)
    // await client.connect();

    const componentCollection = client.db('AshUi').collection('components');
    const backendComponentCollection = client.db('AshUi').collection('backendComponent');

    // Frontend related api 

    app.post('/component', async (req, res) => {
      const data = req.body;
      const result = await componentCollection.insertOne(data);
      res.send(result);
    })

    app.get('/component', async (req, res) => {
      const result = await componentCollection.find().toArray();

      res.send(result);
    })

    app.get('/component/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await componentCollection.findOne(query);
      res.send(result);
    })

    app.put('/component/:id', async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      // console.log('before query');

      // Remove _id from data to prevent modifying the immutable field
      const { _id, ...updateData } = data;

      const query = { _id: new ObjectId(id) };
      // console.log('after query');

      const options = { upsert: true };
      const updatedInfo = {
        $set: updateData // Only set fields excluding _id
      };

      try {
        const result = await componentCollection.updateOne(query, updatedInfo, options);
        res.send(result);
      } catch (error) {
        console.error("Error updating component:", error);
        res.status(500).send("Error updating component");
      }
    });


    app.delete('/component/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await componentCollection.deleteOne(query);
      res.send(result);
    })


    // backend related api 

    app.post('/backendComponent', async (req, res) => {
      const data = req.body;
      const result = await backendComponentCollection.insertOne(data);
      res.send(result);
    })

    app.get('/backendComponent', async (req, res) => {
      const result = await backendComponentCollection.find().toArray();
      res.send(result);
    })

    app.get('/backendComponent/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await backendComponentCollection.findOne(query);
      res.send(result);
    })

    app.put('/backendComponent/:id', async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedInfo = {
        $set: {
          ...data
        }
      }

      const result = await backendComponentCollection.updateOne(query, updatedInfo, options);
      res.send(result);
    })

    app.delete('/backendComponent/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await backendComponentCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('server is ok');
});

app.listen(port, () => {
  console.log(`sever is running on port ${port}`);
});