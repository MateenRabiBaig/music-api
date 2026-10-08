import { Router } from "express";
import { getJioSaavnSong } from "../providers/jiosaavn/jiosaavn.provider.js";

const router = Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  console.log("[GET /api/songs/:id] ID:", id);

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Song ID is required",
    });
    return;
  }

  try {
    const song = await getJioSaavnSong(id);

    if (!song) {
      res.status(404).json({
        success: false,
        message: "Song not found",
      });
      return;
    }

    res.json({
      success: true,
      provider: "jiosaavn",
      song,
    });
  } catch (error) {
    console.error("[GET /api/songs/:id] Error:", error);

    res.status(502).json({
      success: false,
      message: "JioSaavn song details are temporarily unavailable",
    });
  }
});

export default router;