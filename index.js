
const express=require('express')
const app=express()
const cors=require('cors')
const port=process.env.PORT|| 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors());
app.use(express.json())


const uri = "mongodb+srv://scic:JACpkJCbgQEQlwB5@cluster0.n0bjr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    const taskCollection=client.db('TaskDB').collection('tasks');
   const userCollection= client.db('TaskDB').collection('users');


   app.get('/',(req,res)=>{
   res.send('mysha crying')
   })
   app.post('/user/:email',async(req,res)=>{
     const user=req.body;
     const email=req.params.email;
     console.log("user" ,user)
     const isExist=await userCollection.find({email});
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
      console.log(email,"email")
      const task=req.body;
      const isEmail=await taskCollection.find({email}).toArray();
      res.send(isEmail)
    })
    app.post('/task',async(req,res)=>{
      const task=req.body;
      console.log("task is",task)
      const result= await taskCollection.insertOne(task);
      res.send(result);
    })


    
    app.delete('/task/:id',async(req,res)=>{
      const id=req.params.id;
      // const task=req.body;
      const query={_id: new ObjectId(id)};
      const result=await taskCollection.deleteOne({query})
      res.send(result);

    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.listen(port, (res,req)=>{
console.log(`port is running ,${port}`)
})