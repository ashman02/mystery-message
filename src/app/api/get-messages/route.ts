import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { User } from "next-auth"
import mongoose from "mongoose"

export async function GET(request: Request) {
  dbConnect()
  const session = await getServerSession(authOptions)
  const user: User = session?.user as User

  //now we have our user
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    )
  }

  const userId = new mongoose.Types.ObjectId(user._id)
  try {
    const user = await UserModel.aggregate([
        {
            $match : {
                _id : userId
            }
        },
        //we are not storing the object id of the messages we are storing direct message an object
        //so we have to unwind the array 
        {
            $unwind : '$messages'
        },
        {
            $sort : {
                'messages.createdAt' : -1
            }
        },
        //grouping the document 
        {
            $group : {
                _id : '$_id',
                messages : {
                    $push : '$messages'
                }
            }
        }
    ])

    if(!user || user.length === 0){
        return Response.json(
            {
              success: false,
              message: "User not found",
            },
            { status: 401 }
          )
    }

    return Response.json(
        {
          success: true,
          messages: user[0].messages,
        },
        { status: 200 }
      )
  } catch (error) {
    console.log("error while getting the messages", error)
    return Response.json(
        {
          success: false,
          message: "Error while getting the messages",
        },
        { status: 500 }
      )
  }
}
