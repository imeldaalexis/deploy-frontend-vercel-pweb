app.get("/messages", async (req, res) => {
  try {
      const allMessages = await Message.find({}); // Fetch all messages
      
      console.log(`Found ${allMessages.length} messages`); // Log the number of messages found

      return res.json(allMessages); // Return all messages including their messages array
  } catch (error) {
      console.error("Error fetching messages:", error); // Log any errors
      return res.status(500).send(error); // Send a 500 status code for server errors
  }
});