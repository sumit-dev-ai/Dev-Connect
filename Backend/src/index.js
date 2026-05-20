
import app from "./app.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";


connectDB().then(()=>{
    const port = process.env.PORT || 8000;
    app.listen(port,()=>{
        console.log(`the server is running at port ${port}`);
        
    } )
})


