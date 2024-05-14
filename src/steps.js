//Day first 7 May 2024
/**
1. Mastering ZOD 
- created the next js project 
- created models for varification and for backend using mongoose (User, Message)
- instalL ZOD ---
- zod will validate data fetched from user before saving to mongoose

8 May 
2. Connect backend
- some precuations are there 
- we will make lib folder and in that folder we will connenct our database

8-9 May
3. Email Verification
- we will use resend to send emails
- configure resend in lib file
- react-email to make template of email
- made api response to send response
- that's it with our setup now write api 
- we have registered user and sent the verifictation code 

10 may
4. Next auth js
- credentials based login 
- modified token and session 
- middleware
- for testing session provider set

11 may 
5 otp verification and unique username
- we made a route that check if entered username is available
- made a route that checks if a verification code is correct by matching it with the code we have give user

13 may 
6. Message Api with aggregation api
- a post request to toggle message acceptance status 
- and a get request to get message acceptance status
- we have used session to know the logged in user

- aggregation pipeline to get user messages 
- used unwind and group too.

- a route that get message and pushes that message in user message array

14 may
7. Api Intingration 
- vercel ai,
- we have a prompt we will ask ai to generate messages based on the prompt
 */