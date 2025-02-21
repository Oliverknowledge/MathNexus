import mongoose from "mongoose"; //Install mongoose

const userSchema = new mongoose.Schema({
    id: String,
    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    password: {
        type: String,
        required: true,
        
        
    },
    name: String,
    profile_picture: {
        type: String,
        default: "/DefaultAvatar.png"
    },
    role: String,
})

export default mongoose.models.User || mongoose.model('User', userSchema)