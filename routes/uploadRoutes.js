// const upload = require("../middleware/upload");
// const express = require('express');
// const router = express.Router();

// router.post("/upload", upload.single("file"), (req, res) => {
//     if(req.file === undefined) return res.send("you must select a file");

//     const imgUrl = `http://localhost:3003/file/${req.file.filename}`;
//     return res.send(imgUrl); // kalo mau tiap upload langsung keluar gambar
// })  

// router.get("/upload", async (req,res)=> {
//     try {
//         res.status(201).json({message: "Ada routenya"});
//     } catch (error) {
//         res.status(500).json({ error: 'Could not create a new document' });
//     }
// })

// module.exports = router;

