const express = require('express');
const verifyToken = require('./verifyToken');
const Conversation = require('../Models/conversation');
const Message = require('../Models/message');
const { getReceiverSocketId,io } = require('../Socket/Socket');
const router = express.Router();

//Send Message.
router.post('/send/:id', verifyToken, async (req,res)=>{

    try {

        const message = req.body.message;
        const senderId = req.user.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = await Message.create({
            senderId:senderId,
            receiverId:receiverId,
            message:message,
        })

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);


        //SocketIo Functionallity.
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.json(newMessage);

    } catch (error) {


        res.json(error);
    }

})

//Get Message.
router.get('/:id',verifyToken,async (req,res)=>{
    try {
        
        const senderId = req.params.id;
        const receiverId = req.user.id;

        const conversation = await Conversation.findOne({
            participants : {$all : [senderId , receiverId]},
        }).populate("messages");

        if(!conversation) return res.json([]);

        res.json(conversation.messages);

    } catch (error) {
        res.json(error);
    }
})

module.exports = router;