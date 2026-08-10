import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.routes.js";

const app = express();
const origins = (process.env.FRONTEND_ORIGIN || "").split(",").map(x => x.trim()).filter(Boolean);
app.disable("x-powered-by");
app.use((req,res,next)=>{res.setHeader("X-Content-Type-Options","nosniff");res.setHeader("X-Frame-Options","DENY");res.setHeader("Referrer-Policy","strict-origin-when-cross-origin");res.setHeader("Permissions-Policy","camera=(self)");next();});
app.use(cors({ origin: origins.length ? origins : false, methods:["GET","POST","PATCH","OPTIONS"], allowedHeaders:["Content-Type","Authorization"] }));
app.use(express.json({ limit:"100kb" }));
const authHits=new Map();
app.use('/api/auth',(req,res,next)=>{const now=Date.now(),key=req.ip,bucket=(authHits.get(key)||[]).filter(t=>now-t<15*60_000);if(bucket.length>=20)return res.status(429).json({message:'Too many attempts. Please try again later.'});bucket.push(now);authHits.set(key,bucket);next();});
app.use(express.static("public",{extensions:["html"]}));
app.use('/api',apiRoutes);
app.get('/',(_,res)=>res.sendFile(new URL('../public/index.html',import.meta.url).pathname));
app.use((_,res)=>res.status(404).json({message:"Route not found"}));
app.use((err,req,res,next)=>{console.error("API ERROR",err.message);res.status(err.status||500).json({message:err.status?err.message:"Something went wrong. Please try again."});});
export default app;
