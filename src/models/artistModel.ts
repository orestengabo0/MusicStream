import mongoose, { Document } from "mongoose";

interface IArtist extends Document {
    name: string;
    email: string;
    password: string;
    bio?: string;
    artistProfileImage?: string;
    genres: string[];
    followers: mongoose.Schema.Types.ObjectId[];
    songs: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const artistSchema = new mongoose.Schema<IArtist>({
    name: {
        type: String,
        required: true,
        unique: true,
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
    bio: {
        type: String,
        default: "",
    },
    artistProfileImage: {
        type: String,
        default: "",
    },
    genres: {
        type: [String],
        validate: {
            validator: (v: string[]) => v.length > 0,
            message: "An artist must have at least one genre.",
        },
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song",
        },
    ],
}, { timestamps: true });

const Artist = mongoose.model<IArtist>("Artist", artistSchema);
export default Artist;
