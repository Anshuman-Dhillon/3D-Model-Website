import Review from "../models/review.js";
import Question from "../models/question.js";
import Message from "../models/message.js";
import Model from "../models/model.js";
import User from "../models/user.js";

// ======================== REVIEWS ========================

// GET /models/:id/reviews (public)
export async function getReviews(req, res) {
  try {
    const reviews = await Review.find({ model: req.params.id })
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
}

// POST /models/:id/reviews (authenticated, must have purchased)
export async function createReview(req, res) {
  try {
    const userId = req.user.id;
    const modelId = req.params.id;
    const { rating, text } = req.body;

    if (!rating || !text) {
      return res.status(400).json({ message: "Rating and review text are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const model = await Model.findById(modelId);
    if (!model) return res.status(404).json({ message: "Model not found" });

    // Must have purchased (or be the seller for testing)
    const user = await User.findById(userId);
    const hasPurchased = user.purchased_models.some(
      (id) => id.toString() === modelId
    );
    if (!hasPurchased && model.seller.toString() !== userId) {
      return res.status(403).json({ message: "You must purchase this model before reviewing" });
    }

    const review = new Review({
      model: modelId,
      user: userId,
      username: user.settings.personal_info.username,
      rating: Math.round(rating),
      text: text.trim().substring(0, 1000),
    });

    await review.save();

    // Update model's average rating
    const allReviews = await Review.find({ model: modelId });
    const avg =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    model.averageRating = Math.round(avg * 10) / 10;
    model.reviewCount = allReviews.length;
    await model.save();

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You have already reviewed this model" });
    }
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Error creating review" });
  }
}

// ======================== Q&A ========================

// GET /models/:id/questions (public)
export async function getQuestions(req, res) {
  try {
    const questions = await Question.find({ model: req.params.id })
      .sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions" });
  }
}

// POST /models/:id/questions (authenticated)
export async function createQuestion(req, res) {
  try {
    const userId = req.user.id;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Question text is required" });
    }

    const model = await Model.findById(req.params.id);
    if (!model) return res.status(404).json({ message: "Model not found" });

    const user = await User.findById(userId);

    const question = new Question({
      model: req.params.id,
      user: userId,
      username: user.settings.personal_info.username,
      text: text.trim().substring(0, 1000),
    });

    await question.save();
    res.status(201).json(question);
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: "Error creating question" });
  }
}

// POST /questions/:id/answers (authenticated)
export async function createAnswer(req, res) {
  try {
    const userId = req.user.id;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Answer text is required" });
    }

    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const user = await User.findById(userId);

    question.answers.push({
      user: userId,
      username: user.settings.personal_info.username,
      text: text.trim().substring(0, 1000),
    });

    await question.save();
    res.status(201).json(question);
  } catch (error) {
    console.error("Error creating answer:", error);
    res.status(500).json({ message: "Error creating answer" });
  }
}

// ======================== LIKES ========================

// POST /models/:id/like (toggle)
export async function toggleLike(req, res) {
  try {
    const userId = req.user.id;
    const modelId = req.params.id;

    const model = await Model.findById(modelId);
    if (!model) return res.status(404).json({ message: "Model not found" });

    const user = await User.findById(userId);
    const alreadyLiked = user.liked_models.some(
      (id) => id.toString() === modelId
    );

    if (alreadyLiked) {
      user.liked_models = user.liked_models.filter(
        (id) => id.toString() !== modelId
      );
      model.likes = Math.max(0, model.likes - 1);
    } else {
      user.liked_models.push(modelId);
      model.likes += 1;
    }

    await Promise.all([user.save(), model.save()]);

    res.status(200).json({
      liked: !alreadyLiked,
      likes: model.likes,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Error toggling like" });
  }
}

// GET /user/likes (get current user's liked model IDs)
export async function getLikedModels(req, res) {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.liked_models || []);
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Error fetching likes" });
  }
}

// ======================== FOLLOW ========================

// POST /users/:id/follow (toggle)
export async function toggleFollow(req, res) {
  try {
    const userId = req.user.id;
    const targetId = req.params.id;

    if (userId === targetId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(userId),
      User.findById(targetId),
    ]);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const alreadyFollowing = currentUser.following.some(
      (id) => id.toString() === targetId
    );

    if (alreadyFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== userId
      );
    } else {
      currentUser.following.push(targetId);
      targetUser.followers.push(userId);
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.status(200).json({
      following: !alreadyFollowing,
      followerCount: targetUser.followers.length,
    });
  } catch (error) {
    console.error("Error toggling follow:", error);
    res.status(500).json({ message: "Error toggling follow" });
  }
}

// ======================== MESSAGES ========================

// POST /messages (send a message — modelId optional for direct messages)
export async function sendMessage(req, res) {
  try {
    const senderId = req.user.id;
    const { recipientId, modelId, text } = req.body;

    if (!recipientId || !text?.trim()) {
      return res.status(400).json({ message: "Recipient and message text are required" });
    }

    if (senderId === recipientId) {
      return res.status(400).json({ message: "You cannot message yourself" });
    }

    const [sender, recipient] = await Promise.all([
      User.findById(senderId),
      User.findById(recipientId),
    ]);

    if (!recipient) return res.status(404).json({ message: "Recipient not found" });

    // If modelId provided, validate it exists
    let model = null;
    if (modelId) {
      model = await Model.findById(modelId);
      if (!model) return res.status(404).json({ message: "Model not found" });
    }

    const message = new Message({
      model: modelId || null,
      sender: senderId,
      senderName: sender.settings.personal_info.username,
      recipient: recipientId,
      recipientName: recipient.settings.personal_info.username,
      text: text.trim().substring(0, 2000),
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message" });
  }
}

// GET /messages/conversations — list unique conversations
export async function getConversations(req, res) {
  try {
    const userId = req.user.id;

    // Get all messages where user is sender or recipient
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("model", "name thumbnailKey");

    // Group by unique conversation (model + other user, or just other user for DMs)
    const convMap = new Map();
    for (const msg of messages) {
      const otherId =
        msg.sender.toString() === userId
          ? msg.recipient.toString()
          : msg.sender.toString();
      const modelKey = msg.model ? msg.model._id.toString() : "direct";
      const key = `${modelKey}_${otherId}`;
      if (!convMap.has(key)) {
        const otherName =
          msg.sender.toString() === userId ? msg.recipientName : msg.senderName;
        convMap.set(key, {
          modelId: msg.model ? msg.model._id : null,
          modelName: msg.model ? msg.model.name : null,
          otherUserId: otherId,
          otherUsername: otherName,
          lastMessage: msg.text.substring(0, 80),
          lastDate: msg.createdAt,
          unread:
            msg.recipient.toString() === userId && !msg.read ? 1 : 0,
        });
      } else if (msg.recipient.toString() === userId && !msg.read) {
        convMap.get(key).unread += 1;
      }
    }

    res.status(200).json(Array.from(convMap.values()));
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Error fetching conversations" });
  }
}

// GET /messages/:modelId/:userId — get thread for a specific listing + user (or "direct" for DMs)
export async function getThread(req, res) {
  try {
    const currentUserId = req.user.id;
    const { modelId, userId: otherUserId } = req.params;

    const filter = {
      $or: [
        { sender: currentUserId, recipient: otherUserId },
        { sender: otherUserId, recipient: currentUserId },
      ],
    };

    // "direct" means no model context
    if (modelId === "direct") {
      filter.model = null;
    } else {
      filter.model = modelId;
    }

    const messages = await Message.find(filter).sort({ createdAt: 1 });

    // Mark unread messages as read
    const readFilter = {
      sender: otherUserId,
      recipient: currentUserId,
      read: false,
    };
    if (modelId === "direct") {
      readFilter.model = null;
    } else {
      readFilter.model = modelId;
    }
    await Message.updateMany(readFilter, { read: true });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching thread:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
}
