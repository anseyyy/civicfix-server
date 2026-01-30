const termux = require('../models/contactModel');

// Send Message
exports.sendMessage = async (req, res) => {
    console.log("Inside sendMessage Controller");
    const { name, email, subject, message } = req.body;

    try {
        const newMessage = new termux({
            name, email, subject, message
        });
        await newMessage.save();
        res.status(200).json(newMessage);
    } catch (err) {
        console.error("Error sending message:", err);
        res.status(401).json({ error: "Failed to send message" });
    }
};

// Get All Messages
exports.getAllMessages = async (req, res) => {
    console.log("Inside getAllMessages Controller");
    try {
        const messages = await termux.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};
