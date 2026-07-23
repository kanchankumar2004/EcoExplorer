import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Get all conversations for the logged-in user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$text' },
          lastMessageAt: { $first: '$createdAt' },
          lastSender: { $first: '$sender' },
          listingName: { $first: '$listingName' },
          listingType: { $first: '$listingType' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$read', false] }, { $eq: ['$receiver', userId] }] },
                1,
                0,
              ],
            },
          },
          // Collect all participant IDs
          participants: { $addToSet: '$sender' },
          receivers: { $addToSet: '$receiver' },
        },
      },
      { $sort: { lastMessageAt: -1 } },
    ]);

    // Resolve the "other user" for each conversation
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conv) => {
        const allParticipants = [...conv.participants, ...conv.receivers];
        const otherUserId = allParticipants.find(
          (id) => id.toString() !== userId.toString()
        );

        // Self-conversation: user sent messages to themselves (e.g., host contacted own listing)
        const isSelfConversation = !otherUserId;

        const otherUser = otherUserId
          ? await User.findById(otherUserId).select('name email avatar userType')
          : null;

        return {
          conversationId: conv._id,
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
          lastSender: conv.lastSender,
          listingName: conv.listingName,
          listingType: conv.listingType,
          unreadCount: conv.unreadCount,
          otherUserId: otherUserId ? otherUserId.toString() : null,
          isSelfConversation,
          otherUser: otherUser
            ? {
                _id: otherUser._id,
                name: otherUser.name,
                email: otherUser.email,
                avatar: otherUser.avatar,
                userType: otherUser.userType,
              }
            : null,
        };
      })
    );

    res.status(200).json(conversationsWithUsers);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error retrieving conversations' });
  }
};

// @desc    Get message history with a specific user
// @route   GET /api/messages/:userId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    const conversationId = Message.getConversationId(currentUserId, otherUserId);

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    res.status(200).json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error retrieving messages' });
  }
};

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text, listingName, listingType } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !text) {
      return res.status(400).json({ message: 'Receiver and message text are required' });
    }

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: 'Cannot send a message to yourself' });
    }

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: 'You cannot send messages to yourself' });
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const conversationId = Message.getConversationId(senderId, receiverId);

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      conversationId,
      text: text.trim(),
      listingName: listingName || '',
      listingType: listingType || '',
    });

    const populated = await message.populate([
      { path: 'sender', select: 'name avatar' },
      { path: 'receiver', select: 'name avatar' },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error sending message' });
  }
};

// @desc    Mark all messages from a specific user as read
// @route   PUT /api/messages/read/:userId
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    const conversationId = Message.getConversationId(currentUserId, otherUserId);

    await Message.updateMany(
      {
        conversationId,
        receiver: currentUserId,
        read: false,
      },
      { read: true }
    );

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error marking messages as read' });
  }
};

// @desc    Get total unread message count
// @route   GET /api/messages/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      read: false,
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error retrieving unread count' });
  }
};

// @desc    Delete a message (only sender can delete)
// @route   DELETE /api/messages/:messageId
// @access  Private
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete messages you sent' });
    }

    await message.deleteOne();
    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error deleting message' });
  }
};

// @desc    Delete full conversation
// @route   DELETE /api/messages/conversation/:userId
// @access  Private
export const deleteConversation = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;
    const conversationId = Message.getConversationId(currentUserId, otherUserId);

    // Delete all messages in this conversation
    const result = await Message.deleteMany({ conversationId });

    res.status(200).json({ message: 'Conversation deleted successfully', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ message: 'Server error deleting conversation' });
  }
};

// @desc    Delete conversation by conversationId (for self-conversations or orphaned chats)
// @route   DELETE /api/messages/conversation-by-id/:conversationId
// @access  Private
export const deleteConversationById = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { conversationId } = req.params;

    // Verify the user is a participant in this conversation
    const sample = await Message.findOne({
      conversationId,
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    });

    if (!sample) {
      return res.status(404).json({ message: 'Conversation not found or you are not a participant' });
    }

    const result = await Message.deleteMany({ conversationId });

    res.status(200).json({ message: 'Conversation deleted successfully', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Delete conversation by id error:', error);
    res.status(500).json({ message: 'Server error deleting conversation' });
  }
};
