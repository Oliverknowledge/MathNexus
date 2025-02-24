import mongoose from "mongoose"; //Install mongoose

const userSchema = new mongoose.Schema({
    id: String,
    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    name: String,
    image: {
        type: String,
        default: "/DefaultAvatar.png"
    },
    solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    role: String,
})

export default mongoose.models.User || mongoose.model('User', userSchema)