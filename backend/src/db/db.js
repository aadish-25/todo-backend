import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_COLLECTION}`)
    } catch (error) {
        console.log("Unable to connect to MongoDB")
        process.exit(1)
    }
    console.log(`MongoDB connection succesfull : ${process.env.MONGODB_URI}/${process.env.MONGODB_COLLECTION}`)
}