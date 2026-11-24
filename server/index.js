import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import multer from "multer";
import {v2 as cloudinary} from "cloudinary";

const app=express(),PORT=process.env.PORT||5000;
const production=process.env.NODE_ENV==="production";
const origins=(process.env.CLIENT_ORIGIN||"http://localhost:5173").split(",").map(x=>x.trim()).filter(Boolean);
const cookieOptions={httpOnly:true,secure:production,sameSite:production?"none":"lax",path:"/",maxAge:8*60*60*1000};
const sections=["profile","skills","experience","projects","certificates"];
const Content=mongoose.model("Content",new mongoose.Schema({section:{type:String,unique:true,required:true},data:{type:mongoose.Schema.Types.Mixed,required:true}},{timestamps:true}));
const Admin=mongoose.model("Admin",new mongoose.Schema({email:{type:String,unique:true,lowercase:true,trim:true},passwordHash:String},{timestamps:true}));
const Message=mongoose.model("Message",new mongoose.Schema({name:{type:String,required:true,maxlength:80},email:{type:String,required:true,maxlength:160},message:{type:String,required:true,maxlength:3000},read:{type:Boolean,default:false}},{timestamps:true}));
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({origin(origin,cb){if(!origin||origins.includes(origin))return cb(null,true);cb(new Error("Origin not allowed"));},credentials:true}));
app.use(express.json({limit:"1mb"}));
app.use("/api/auth",rateLimit({windowMs:900000,limit:10,standardHeaders:true,legacyHeaders:false}));
app.use("/api/public/contact",rateLimit({windowMs:3600000,limit:5,standardHeaders:true,legacyHeaders:false}));
function checkOrigin(req,res,next){if(!origins.includes(req.get("origin")))return res.status(403).json({message:"Request origin not allowed."});next();}
app.use("/api/admin",checkOrigin);
app.use("/api/auth/login",checkOrigin);
app.use("/api/auth/logout",checkOrigin);
const emailOK=x=>typeof x==="string"&&x.length<=160&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
function auth(req,res,next){
 const token=req.headers.cookie?.split(";").map(x=>x.trim()).find(x=>x.startsWith("portfolio_session="))?.slice("portfolio_session=".length)||"";
 if(!token)return res.status(401).json({message:"Authentication required."});
 try{req.admin=jwt.verify(token,process.env.JWT_SECRET,{issuer:"soham-portfolio"});next();}
 catch{return res.status(401).json({message:"Session expired. Please sign in again."});}
}
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:8*1024*1024},fileFilter(req,file,cb){const ok=["image/jpeg","image/png","image/webp","application/pdf"].includes(file.mimetype);cb(ok?null:new Error("Only JPG, PNG, WEBP and PDF files are allowed."),ok);}});
function validFile(file){
 const b=file.buffer,m=file.mimetype;
 if(m==="image/jpeg")return b.length>=3&&b[0]===0xff&&b[1]===0xd8&&b[2]===0xff;
 if(m==="image/png")return b.length>=8&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
 if(m==="image/webp")return b.length>=12&&b.toString("ascii",0,4)==="RIFF"&&b.toString("ascii",8,12)==="WEBP";
 if(m==="application/pdf")return b.length>=5&&b.toString("ascii",0,5)==="%PDF-";
 return false;
}
app.get("/api/health",(req,res)=>res.json({status:"ok",database:mongoose.connection.readyState===1?"connected":"disconnected"}));
app.get("/api/public/portfolio",async(req,res,next)=>{try{const docs=await Content.find({section:{$in:sections}}).lean();res.set("Cache-Control","public, max-age=60").json(Object.fromEntries(docs.map(x=>[x.section,x.data])));}catch(e){next(e);}});
app.post("/api/public/contact",async(req,res,next)=>{try{const {name,email,message}=req.body||{};if(typeof name!=="string"||name.trim().length<2||name.length>80||!emailOK(email)||typeof message!=="string"||message.trim().length<10||message.length>3000)return res.status(400).json({message:"Enter a valid name, email and message (10–3000 characters)."});await Message.create({name:name.trim(),email:email.trim().toLowerCase(),message:message.trim()});res.status(201).json({message:"Message received."});}catch(e){next(e);}});
app.post("/api/auth/setup",async(req,res,next)=>{try{if(!process.env.ADMIN_SETUP_KEY||req.body?.setupKey!==process.env.ADMIN_SETUP_KEY)return res.status(403).json({message:"Invalid setup key."});if(await Admin.countDocuments())return res.status(409).json({message:"Administrator already configured."});const {email,password}=req.body||{};if(!emailOK(email)||typeof password!=="string"||password.length<12||password.length>128)return res.status(400).json({message:"Use a valid email and a password between 12 and 128 characters."});await Admin.create({email:email.trim().toLowerCase(),passwordHash:await bcrypt.hash(password,12)});res.status(201).json({message:"Administrator created."});}catch(e){next(e);}});
app.post("/api/auth/login",async(req,res,next)=>{try{const {email,password}=req.body||{};if(!emailOK(email)||typeof password!=="string")return res.status(400).json({message:"Email and password are required."});const admin=await Admin.findOne({email:email.trim().toLowerCase()});if(!admin||!await bcrypt.compare(password,admin.passwordHash))return res.status(401).json({message:"Incorrect email or password."});const token=jwt.sign({sub:admin.id,email:admin.email},process.env.JWT_SECRET,{expiresIn:"8h",issuer:"soham-portfolio"});res.cookie("portfolio_session",token,cookieOptions).json({message:"Signed in.",expiresIn:28800});}catch(e){next(e);}});
app.post("/api/auth/logout",(req,res)=>res.clearCookie("portfolio_session",{httpOnly:true,secure:production,sameSite:production?"none":"lax",path:"/"}).json({message:"Signed out."}));
app.get("/api/admin/content/:section",auth,async(req,res,next)=>{try{if(!sections.includes(req.params.section))return res.status(404).json({message:"Unknown section."});const doc=await Content.findOne({section:req.params.section}).lean();res.json({section:req.params.section,data:doc?.data??(req.params.section==="profile"?{}:[])});}catch(e){next(e);}});
app.put("/api/admin/content/:section",auth,async(req,res,next)=>{try{const section=req.params.section,data=req.body?.data;if(!sections.includes(section))return res.status(404).json({message:"Unknown section."});if(data==null||(section==="profile"?(typeof data!=="object"||Array.isArray(data)):!Array.isArray(data)))return res.status(400).json({message:section==="profile"?"Profile must be a JSON object.":"This section must be a JSON array."});const doc=await Content.findOneAndUpdate({section},{$set:{data}},{upsert:true,new:true,runValidators:true});res.json({message:"Content saved.",data:doc.data});}catch(e){next(e);}});
app.get("/api/admin/messages",auth,async(req,res,next)=>{try{res.json({messages:await Message.find().sort({createdAt:-1}).limit(100).lean()});}catch(e){next(e);}});
app.patch("/api/admin/messages/:id/read",auth,async(req,res,next)=>{try{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:"Invalid message ID."});if(typeof req.body?.read!=="boolean")return res.status(400).json({message:"Read must be true or false."});const message=await Message.findByIdAndUpdate(req.params.id,{read:req.body.read},{new:true});if(!message)return res.status(404).json({message:"Message not found."});res.json({message});}catch(e){next(e);}});
app.delete("/api/admin/messages/:id",auth,async(req,res,next)=>{try{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:"Invalid message ID."});const message=await Message.findByIdAndDelete(req.params.id);if(!message)return res.status(404).json({message:"Message not found."});res.json({message:"Message deleted."});}catch(e){next(e);}});
app.post("/api/admin/upload",auth,upload.single("file"),async(req,res,next)=>{try{if(!req.file)return res.status(400).json({message:"Choose a file."});if(!validFile(req.file))return res.status(400).json({message:"File content does not match its file type."});if(!process.env.CLOUDINARY_CLOUD_NAME||!process.env.CLOUDINARY_API_KEY||!process.env.CLOUDINARY_API_SECRET)return res.status(503).json({message:"Configure Cloudinary credentials on the backend first."});cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET,secure:true});const pdf=req.file.mimetype==="application/pdf";const result=await new Promise((resolve,reject)=>{const stream=cloudinary.uploader.upload_stream({folder:"soham-portfolio",resource_type:pdf?"raw":"image",use_filename:true,unique_filename:true},(err,out)=>err?reject(err):resolve(out));stream.end(req.file.buffer);});res.status(201).json({url:result.secure_url,publicId:result.public_id,bytes:result.bytes});}catch(e){next(e);}});
app.use((err,req,res,next)=>{if(err instanceof multer.MulterError)return res.status(400).json({message:err.code==="LIMIT_FILE_SIZE"?"File exceeds 8 MB.":"Upload failed."});if(err.message==="Origin not allowed")return res.status(403).json({message:err.message});console.error(err);res.status(500).json({message:"Something went wrong. Please try again."});});
if(!process.env.MONGODB_URI)throw Error("MONGODB_URI is required.");
if(!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32)throw Error("JWT_SECRET must be at least 32 characters.");
await mongoose.connect(process.env.MONGODB_URI);
app.listen(PORT,()=>console.log("Portfolio API listening on "+PORT));
