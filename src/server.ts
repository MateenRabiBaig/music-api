import "dotenv/config";
import { buildApp } from "./app.js";

const app = buildApp();

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT,HOST,()=>{
    console.log(`Server running at port : http://localhost:${PORT}`);
})