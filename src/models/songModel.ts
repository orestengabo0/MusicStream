import mongoose from "mongoose";

interface ISong extends Document {
    title: string;
    artist: mongoose.Schema.Types.ObjectId;
    genre: string;
    album: string;
    releaseDate: Date;
    duration: number;
    audioUrl: string;
    coverImage: string;
    likes: number;
    featuredArtists: string[];
    playCount: number;
}

const songSchema = new mongoose.Schema<ISong>({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    album: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    audioUrl: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    featuredArtists: {
        type: [String]
    },
    playCount: {
        type: Number,
        default: 0
    }
})

const Song = mongoose.model<ISong>("Song", songSchema);

export default Song;