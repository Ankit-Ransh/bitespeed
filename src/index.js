import express from "express";
import cors from "cors";
import dotenv from "dotenv";    
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Welcome to the Bitespeed Identity Reconciliation API"
    })
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})