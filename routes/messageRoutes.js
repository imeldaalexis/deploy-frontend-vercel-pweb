const express = require('express');
const Message = require('../Models/messageModel.js');  // Import the Message model
const path = require('path'); 
const router = express.Router();

//init app and middleware
const app = express()
app.use(express.json());

// // Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, 'FrontEnd')));

// // Serve index.html when accessing the root ("/") URL



router.get("/messages", async (req, res) => {
  try {
      const allMessages = await Message.find({}).select('-_id _data id body hasMedia from to timestamp hasQuotedMsg'); 
      console.log(`Found ${allMessages.length} messages`); 

      return res.json(allMessages); 
  } catch (error) {
      console.error("Error fetching messages:", error); 
      return res.status(500).send(error); 
  }
});

router.post("/messages", async (req,res)=> {
    const message = req.body;

    try {
        const newMessage = await Message.create(message);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Could not create a new document' });
    }
})

router.get("/messages/:senderId", async (req, res) => {
  try {
      const id = req.params.senderId;
      const message = await Message.findOne({ senderId: id });
  
      if (!message) {
          return res.status(404).json({
              error: "No message found", 
          });
      }
      
      return res.json(message); 
  } catch (error) {
      return res.status(500).send(error);
  }
});

router.get("/post", async (req, res) => {
  return res.status(200).send("aku ada"); 
})

router.post('/post', async (req, res) => {
    console.log("Request body:", req.body); // Log the incoming request body
    try {
      
      let fileBase64 = "";
      const body = req.body.body; // "Hello World"
      const currentContact = req.body.currentContact; // "123456789"
      const myContact = req.body.myContact; // "987654321"
      fileBase64 = req.body.fileBase64; // "...base64String..."
      

      // Check required fields
      if (!body || !currentContact || !myContact) {
        return res.status(400).json({ error: "Missing required fields: body, currentContact, or myContact." });
      }

      const timestamp = Date.now();
      const datemessage = Math.floor(timestamp / 1000);
  
      let newMessage;
      if (fileBase64 != "") {
        // Create a message for media
        newMessage = new Message({
          _data: {
            id: {
              fromMe: true,
              remote: currentContact,
              id: `${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
              _serialized: `true_${currentContact}_${timestamp}`
            },
            viewed: false,
            body: fileBase64, // Use Base64 string as the body for media
            type: "image", // Change type to indicate it's image
            t: datemessage,
            notifyName: "You",
            from: myContact,
            to: currentContact,
            ack: 1,
            isNewMsg: true,
            star: false,
            recvFresh: true,
            viewMode: "VISIBLE",
            timestamp
          },
          id: {
            fromMe: true,
            remote: currentContact,
            id: `${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
            _serialized: `true_${currentContact}_${timestamp}`
          },
          ack: 1,
          hasMedia: true, // Mark it as media
          body: fileBase64, // Use Base64 string
          type: "image", // Change type
          timestamp,
          from: myContact,
          to: currentContact,
          deviceType: "web",
          hasReaction: false,
          links: [],
          fromMe: true
        });
      } else {
        // Create a message for text
        newMessage = new Message({
          _data: {
            id: {
              fromMe: true,
              remote: currentContact,
              id: `${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
              _serialized: `true_${currentContact}_${timestamp}`
            },
            viewed: false,
            body: body,
            type: "chat",
            t: datemessage,
            notifyName: "You",
            from: myContact,
            to: currentContact,
            ack: 1,
            isNewMsg: true,
            star: false,
            recvFresh: true,
            viewMode: "VISIBLE",
            timestamp
          },
          id: {
            fromMe: true,
            remote: currentContact,
            id: `${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
            _serialized: `true_${currentContact}_${timestamp}`
          },
          ack: 1,
          hasMedia: false,
          body: body,
          type: "chat",
          timestamp,
          from: myContact,
          to: currentContact,
          deviceType: "web",
          hasReaction: false,
          links: [],
          fromMe: true
        });
      }
  
      // Save the new message to the database
      await newMessage.save();
  
      console.log("Message saved:", newMessage);
  
      // Redirect upon successful save
      res.redirect("http://localhost:3003/");
    } catch (error) {
      console.error("Error saving message:", error);
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
});
  

module.exports = router;
