import mongoose from "mongoose";

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    profileImage?: string;
    likedSongs: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String
    },
    likedSongs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    }]
},{timestamps: true});

const User = mongoose.model<IUser>("User", userSchema);

export default User;