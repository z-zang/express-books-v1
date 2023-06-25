import express, { Application, Request, Response} from "express";
import dotenv from "dotenv";
import bookRoutes from "./routes/books.ts";
import userRoutes from "./routes/users.ts";

dotenv.config();

const port = process.env.PORT || 8080
const app: Application = express();

// parses incoming Content-Type application/json from req.body
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req: Request, res: Response) => res.json({ message: `api working!!!!`}))

app.use('/api/books', bookRoutes)
app.use('/api/users', userRoutes)

const server = app.listen(port, () => {
    console.log(`server started on port: ${port}`)
})

export {
    server,
    app
} 

