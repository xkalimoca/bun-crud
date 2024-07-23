import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";

interface Post {
    id?: number
    title: string
    path: string
    content: string
}

//create a prisma client
const prisma = new PrismaClient({
    log: ["info", "warn", "error"],
});

//create a elysia instance add pass db context
const app = new Elysia().decorate("db", prisma);

//fetch all posts
app.get("/posts", ({ db }) => {
    return db.post.findMany();
});

//fetch a single posts by id
app.get("/posts/:id", ({ db, params }) => {
    return db.post.findUnique({ where: { id: Number(params.id) } })
})

//fetch a single posts by path
app.get("/posts/path/:path", ({ db, params }) => {
    return db.post.findUnique({ where: { path: String(params.path) } })
})

//create a post
app.post("/posts", ({ db, body }) => {
    return db.post.create({
        data: body as Post
    });
});

//app listen onw port 3000
app.listen(process.env.API_PORT || 3000, () => {
    console.log(`listening on port ${app.server?.port}`);
});
