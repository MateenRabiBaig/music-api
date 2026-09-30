import { Router } from "express";
import { searchSong } from "../services/search.service.js";

const router = Router();

router.get("/", async(req,res) => {
    const query = String(req.query.q ?? "").trim();

    if(!query) {
        res.status(400).json({ success: false, message: "Search query is required" });
        return;
    }

    try {
        const result = await searchSong(query);
        res.json(result);
    }
    catch(error) {
        console.log("Song search failed", error);
        res.status(502).json({ success: false, message: "JioSaavn search is temporarily unavailable" })
    }
})

export default router;