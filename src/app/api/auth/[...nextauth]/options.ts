import { NextAuthOptions } from "next-auth"
import  CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"

//you can do all of this in route file you but for clean and production grade code use options file and export

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      //id and name is not that important we write them this way
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect()
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          })

          if (!user) {
            throw new Error("no user found with this email")
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before login")
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (isPasswordCorrect) {
            return user
          } else {
            throw new Error("incorrect password")
          }
        } catch (err: any) {
          throw new Error(err)
        }
      },
    }),
  ],
  //we are adding user details in token and session so we dont have to make api calls
  //we have to modifie the user in next-auth.d.ts
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString()
        token.isVerified = user.isVerified
        token.isAcceptingMessages = user.isAcceptingMessages
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id
        session.user.isVerified = token.isVerified
        session.user.isAcceptingMessages = token.isAcceptingMessages
        session.user.username = token.username
      }
      return session
    },
    
  },
  //changing the default url
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
