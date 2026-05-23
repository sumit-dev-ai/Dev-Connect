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

// request / response logger
app.use((req, res, next) => {
  const requestLog = {
    method: req.method,
    url: req.originalUrl || req.url,
    payload: {
      params: req.params || {},
      query: req.query || {},
      body: req.body || {}
    }
  };

  let responseBody;
  const originalSend = res.send.bind(res);

  res.send = (body) => {
    responseBody = body;
    return originalSend(body);
  };

  res.on("finish", () => {
    const responseLog = {
      status: res.statusCode,
      data: responseBody
    };

    console.log(JSON.stringify({ request: requestLog, response: responseLog }, null, 2));
  });

  next();
});

//user router
import userRouter from "./routes/user.route.js"
app.use("/api/v1/users",userRouter);

//post router
import postRouter from "./routes/post.route.js"
app.use("/api/v1/posts",postRouter)

//Comment router 
import commentRouter from "./routes/comment.route.js"
app.use("/api/v1/comments", commentRouter);


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