import express from 'express';
import searchRoutes from './routes/search.routes.js';
import songRoutes from "./routes/song.routes.js";

export function buildApp() {
    const app = express();

    app.use(express.json());

    app.get("/health", (_req,res) => {
        res.json({
            status: "success",
            message: "Backend Running",
            timestamp: new Date().toISOString()
        })
    })

    app.use("/api/search", searchRoutes);
    app.use("/api/songs", songRoutes);

    return app;
}