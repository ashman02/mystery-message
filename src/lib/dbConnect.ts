import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

//in next js we have to check if our database is connected or not to check we have made this object if connection.isConnected it means database is connected

const connection : ConnectionObject = {}


//dbConnect is returning promise void means we dont care 
async function dbConnect() : Promise<void> {
    //check if already connected
    if(connection.isConnected){
        console.log("Already connected to database")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        connection.isConnected = db.connections[0].readyState
        console.log("DB connected successfully")
    } catch (error) {
        // if data base connection failed than we have to exit all the proccess because it will not run 
        console.log("DB connection failed", error)
        process.exit(1)
    }
}

export default dbConnect;