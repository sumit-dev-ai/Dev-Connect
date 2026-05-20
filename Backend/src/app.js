import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//user router
import userRouter from "./routes/user.route.js"
app.use("/api/v1/users",userRouter);

//post router
import postRouter from "./routes/post.route.js"
app.use("/api/v1/posts",postRouter)

//must be last
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        statusCode,
        success: false,
        message: err.message || "Internal Server Error"
    });
});
export default app;