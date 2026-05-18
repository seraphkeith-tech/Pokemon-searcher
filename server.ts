import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add JSON parsing middleware
  app.use(express.json());

  // API Route: Proxy Pokemon List and Details
  // This helps bypass potential browser fetch limitations and allows for consolidated requests
  app.get("/api/pokemon", async (req, res) => {
    try {
      const { limit = "151", offset = "0" } = req.query;
      const listResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
      
      if (!listResponse.ok) {
        throw new Error(`PokeAPI error: ${listResponse.status}`);
      }
      
      const listData = await listResponse.json();
      
      // Fetch details in controlled batches of 20 to avoid "Failed to fetch" errors
      const results = listData.results;
      const details = [];
      const batchSize = 25;
      
      for (let i = 0; i < results.length; i += batchSize) {
        const batch = results.slice(i, i + batchSize);
        const batchPromises = batch.map((p: any) => 
          fetch(p.url).then(r => {
            if (!r.ok) return null;
            return r.json();
          })
        );
        const batchResults = await Promise.all(batchPromises);
        details.push(...batchResults.filter(Boolean));
      }

      res.json(details);
    } catch (error: any) {
      console.error("Server API Error:", error.message);
      res.status(500).json({ error: "Failed to fetch pokemon data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // In Express v4, use app.get('*', ...)
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
