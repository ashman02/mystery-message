import 'next-auth';
import { DefaultSession } from 'next-auth';


//we can't get user id directly from next-auth user because we have to define in interface of the user so we are modifying the user interface
declare module 'next-auth' {
    interface User {
        _id? : string;
        isVerified? : boolean;
        isAcceptingMessages? : boolean;
        username? : string
    }
    interface Session {
        user : {
            _id? : string;
            isVerified? : boolean;
            isAcceptingMessages? : boolean;
            username? : string
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id? : string;
        isVerified? : boolean;
        isAcceptingMessages? : boolean;
        username? : string
    }
}