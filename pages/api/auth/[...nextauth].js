import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'
import { Admin } from '@/models/Admin';
import { mongooseConnect } from '@/lib/mongoose';

// const adminEmails = ['aryankumargupta1106@gmail.com'];

async function isAdminEmail(email) {
  mongooseConnect();
  return true;
  // const check = await Admin.findOne({email});
  // console.log(check);
  // return (await Admin.findOne({email}));
  return !! (await Admin.findOne({email}))
}
console.log(isAdminEmail());

export const authOption = {
  secret:process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session:async({session,token,user}) => {
      if (await isAdminEmail(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
      return sessionStorage;
    }
  }
}

export default NextAuth(authOption);


export async function isAdminRequest(req,res) {
  const session = await getServerSession(req,res,authOption);
  if (!(await isAdminEmail(session?.user?.email))) {
    res.status(401);
    res.end();
    throw 'Not an admin';
  }
} 