
const express=require('express')
const app=express()
const cors=require('cors')
const port=process.env.PORT|| 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.n0bjr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


app.get('/',(req,res)=>{
  res.send('mysha crying')
  })
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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    const taskCollection=client.db('TaskDB').collection('tasks');
   const userCollection= client.db('TaskDB').collection('users');

   app.post('/user/:email',async(req,res)=>{
     const user=req.body;
     const email=req.params.email;
    //  console.log("user" ,user)
     const isExist=await userCollection.findOne({email});
     const result= await userCollection.insertOne(user)
     if(isExist)
      res.send({ message: "User already exists", user: isExist });
      else
      res.send(result)
   })
    app.get('/task',async(req,res)=>{
       const result=await taskCollection.find().toArray();
       res.send(result)
    })
    app.get('/task/:email',async(req,res)=>{
      const email=req.params.email;
      // console.log(email,"email")
      const task=req.body;
      const isEmail=await taskCollection.find({email:email}).toArray();
      res.send(isEmail)
    })
    app.post('/task',async(req,res)=>{
      const task=req.body;
      // console.log("task is",task)
      const result= await taskCollection.insertOne(task);
      res.send(result);
    })

    app.put('/task/:id', async (req, res) => {
      const taskId = req.params.id;
      const updatedTask = req.body;
  
      // console.log("Received ID:", taskId);
      // console.log("Received Task Data:", updatedTask);
  
      if (!taskId || !updatedTask) {
          return res.status(400).json({ message: "Missing required fields" });
      }
  
      try {
          const result = await taskCollection.updateOne(
              { _id: new ObjectId(taskId) }, // Convert ID properly
              { $set: updatedTask }
          );
  
          if (result.matchedCount === 0) {
              return res.status(404).json({ message: "Task not found" });
          }
  
          res.send( result );
      } catch (error) {
          // console.error("Error updating task:", error);
          res.status(500).json({ message: "Internal Server Error", error });
      }
  });
  
  
    app.delete('/task/:id',async(req,res)=>{
      const id=req.params.id;
      // const task=req.body;
      const query={_id: new ObjectId(id)};
      const result=await taskCollection.deleteOne(query)
      
      res.send(result);

    })

    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.listen(port, () => {
  // console.log(`Server is running on port ${port}`);
});
