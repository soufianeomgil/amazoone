import mongoose from "mongoose";
export interface IAccount {
   userId: mongoose.Schema.Types.ObjectId;
   provider: string;
   providerAccountId: string;
   name: string;
   password?: string;
   image?: string
}

const AccountSchema = new mongoose.Schema<IAccount> ({
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
     },
     provider: {
        type:String,
        required: true
     },
     providerAccountId: {
        type:String,
        required: true
     },
    
     name:{
            type:String,
            required: true
      },
     image: {
        type: String,
     },
     password: {
        type: String
     }
}, {
    timestamps: true
})
const Account = mongoose.models.Account || mongoose.model<IAccount>('Account',AccountSchema)
export default Account