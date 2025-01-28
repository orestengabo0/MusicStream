import mongoose from "mongoose";

interface IPlaylist extends Document {
    name: string;
    description?: string;
    songs: mongoose.Schema.Types.ObjectId[];
    owner: mongoose.Schema.Types.ObjectId;
    isPrivate: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const playlistSchema = new mongoose.Schema<IPlaylist>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isPrivate: {
        type: Boolean,
        default: false
    }
},{timestamps: true});