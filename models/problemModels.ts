import mongoose from "mongoose"; //Install mongoose

const problemSchema = new mongoose.Schema({
    title: String,
    description: String,
    difficulty: String,
    hints: [String],
    solution: String,
    year: Number,
    answer: String,
    
})

export default mongoose.models.Problem || mongoose.model('Problem', problemSchema)