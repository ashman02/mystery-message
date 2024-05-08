import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

//you have to define your request as function name
export async function POST(request : Request){
    //connect database - you have to connect database with every request that is why we checked if already connected or not
    await dbConnect()

    try {
        // get email, username, password from frontend
        const {username, email, password} = await request.json()
    } catch (error) {
        console.error("Error registering user", error)
        return Response.json(
            {
                success : false,
                message : "Error registering user"
            },
            {
                status : 500
            }
        )
    }
}