//importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./messageDB.js";
import Pusher from "pusher";
import cors from "cors";

//app config
const app = express();
const port=process.env.port||5001

const pusher = new Pusher({
    appId: "1130973",
    key: "5d400e643b0c694845f9",
    secret: "0059824308029ba7636d",
    cluster: "eu",
    useTLS: true
  });

//middleware
app.use(express.json());
app.use(cors());

// app.use((req,res,next)=>{
//     res.setHeader("Access-Control-Allow-origin","*");
//     res.setHeader("Access-Control-Allow-Headers","*");
//     next();
// })

//DB connection
const connection_url="YOUR CLUSTER URL"
mongoose.connect(connection_url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false  
});

const db = mongoose.connection

db.once("open",()=>{
    console.log("Connected DB");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change",(change)=>{
    
        if(change.operationType === "insert"){
            const messageDetails = change.fullDocument;
            pusher.trigger("messages","inserted",
                {
                    name:messageDetails.name,
                    message:messageDetails.message,
                    timestamp:messageDetails.timestamp,
                    received: messageDetails.received
                }
            );
        }else{
            console.log("trigering error");
        }
    
    });
})

//DB config

//??????

//api routes
app.get("/messages/sync",(req,res)=>{
    Messages.find((err, data) =>{
        if(err) {
            res.status(500).send(err);
        }else{
            res.status(200).send(data);
        }
    })
})

app.post("/messages/new",(req,res)=>{
    const dbMessage = req.body

    Messages.create(dbMessage,(err,data)=>{
        if(err) {
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})

//listen
app.listen(port,()=>{
    console.log(`Hello from localhost port:${port}`);
})
