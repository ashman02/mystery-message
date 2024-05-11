import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"

export async function POST(request: Request) {
  await dbConnect()
  try {
    const { username, code } = await request.json()

    //when you get values from params you should decode that
    const decodedUsername = decodeURIComponent(username)

    const user = await UserModel.findOne({ username: decodedUsername })

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      )
    }

    //now compare the code and check expiry of the code
    const isValid = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    if (isValid && isCodeNotExpired) {
      user.isVerified = true
      await user.save()
      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      )
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired, Please sign up again to get a new verification code",
        },
        { status: 400 }
      )
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification code",
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error verifying user", error)
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    )
  }
}
