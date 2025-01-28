import mongoose from "mongoose";

interface IArtist extends Document {
    name: string;
    bio?: string;
    profileImage?: string;
    genres: string[];
    followers: number;
}

const artistSchema = new mongoose.Schema<IArtist>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String
    },
    profileImage: {
        type: String
    },
    genres: {
        type: [String],
        required: true,
    },
    followers: {
        type: Number,
        default: 0
    }
},{timestamps: true});

const Artist = mongoose.model<IArtist>("Artist", artistSchema);
export default Artist;