import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

//we are writing this functionallity to check the username while user is entering the username 
//like in instagram

//if should be under these conditions 
const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request : Request){
    dbConnect()
    try {
        //we will get url and query parameter so we have to get that 
        const {searchParams} = new URL(request.url)
        const queryParams = {
            username : searchParams.get('username')
        }
        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParams)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success : false,
                message : usernameErrors.length > 0 ? usernameErrors.join(', ')  : "Invalid query parameter"
            }, {status : 400})
        }
        //get username from result 
        const {username} = result.data
        //check if username is unique
        const existingVerifiedUser = await UserModel.findOne({username, isVerified : true})

        if(existingVerifiedUser){
            return Response.json({
                success : false,
                message : "Username is already taken"
            }, {status : 400})
        }
        return Response.json({
            success : true,
            message : "Username is unique"
        }, {status : 400})
        
    } catch (error) {
         console.error("Error while checking username", error)
         return Response.json({
            success : false,
            message : "error checking username"
         }, {status : 500})
    }
}