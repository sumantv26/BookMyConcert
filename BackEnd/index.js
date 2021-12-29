const express = require('express');
const app= express();


app.use(express.json());
app.use(express.urlencoded());

app.post("/test",(req,res)=>{
    console.log(req.body)
    res.send("hello from server")
})

app.listen(5000,()=>console.log("lisiting at port 5000"))