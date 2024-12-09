const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.e9oaa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
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
       
        // await client.connect();
      const reviewer=client.db('reviewDB').collection('reviewers')
      const rooms=client.db('roomsDB').collection('room')


        app.post('/user',async(req,res)=>{
            const alldata=req.body;
            const result=await reviewer.insertOne(alldata);
            res.send(result)
        });

        app.get('/user',async(req,res)=>{
            const courser=reviewer.find();
            const result=await courser.toArray();
            res.send(result);
        })
        
        app.post('/bookings', async (req, res) => {
            const { id, roomSize, price, availability, image } = req.body;
        
            if (!id || !roomSize || !price || !availability || !image) {
                return res.status(400).send({ error: "Missing required fields" });
            }
        
            const result = await rooms.insertOne({ id, roomSize, price, availability, image });
            res.send(result);
        });
        

        app.get('/bookings',async(req,res)=>{
            const courser=rooms.find();
            const result=await courser.toArray();
            res.send(result);
        })

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
        
            try {
                const result = await bookingsCollection.deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount === 1) {
                    res.send({ success: true, message: "Room deleted successfully" });
                } else {
                    res.status(404).send({ success: false, message: "Room not found" });
                }
            } catch (error) {
                console.error("Error deleting room:", error);
                res.status(500).send({ success: false, message: "Internal server error" });
            }
        });
        

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
       
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('server is running')
});

app.listen(port, () => {
    console.log(`server is${port}`);
})
