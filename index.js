//testo
const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const cors = require('cors');
const path = require('path');
const app = express();
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require("./routes/uploadRoutes");

const PORT = process.env.PORT || 3003;
console.log(PORT);


app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'FrontEnd')));
app.use(express.urlencoded({ extended: true }));
app.use('/api', messageRoutes);

const mongoURI = "mongodb://imeldaalexisjbaru:1Gh8Y4DxDNf8GB47@cluster0-shard-00-00.g70d8.mongodb.net:27017,cluster0-shard-00-01.g70d8.mongodb.net:27017,cluster0-shard-00-02.g70d8.mongodb.net:27017/chatAppRevisi?replicaSet=atlas-9d8ugm-shard-0&ssl=true&authSource=admin"
console.log(mongoURI);

mongoose.connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => console.error("MongoDB connection error:", err));

// let gfs
const db = mongoose.connection;
// db.once('open', () => { //maybe add chatAppRevisi here?
//   console.log('Connected to MongoDB database chatAppRevisi');
//   gfs = Grid(db.db, mongoose.mongo);
//   gfs.collection("photos");
// });

// app.get("file/:filename", async(req, res) =>{
//   try {
//     const file = await gfs.files.findOne({filename: req.params.filename});
//     const readStream = gfs.createReadStream(file.filename);
//     readStream.pipe(res)
//   } catch (error) {
//     res.send('not found')
//   }
// })

// app.get('/', async(req, res) => {
//   return res.status(200).send("Successful");
// })

app.get("/styles.css", async (req, res) => {
  res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get("/", async(req, res) => {
  res.sendFile(path.join(__dirname, 'index_coba.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
