import mongoose,{Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema : Schema<Message> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
});


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifycode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    message: Message[];
}

const UserSchema : Schema<User> = new Schema({
    username: { 
        type: String, 
        required:[true, "Username is required" ] ,
        trim: true ,
        unique: true 
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please use a valid email address"]
    },
    password: { 
        type: String, 
        required: [true, "Password is required" ],
        min: [8, "Password must be at least 8 characters long"],
        max: [32, "Password must be at most 32 characters long"],
    },
    verifycode: { 
        type: String, 
        required: true 
    },
    verifyCodeExpiry: { 
        type: Date, 
        required: true

    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    isAcceptingMessages: { 
        type: Boolean, 
        default: true 
    },
    message: { 
        type: [MessageSchema], 
        default: [] 
    },
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;