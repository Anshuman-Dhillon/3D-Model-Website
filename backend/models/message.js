import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // The model listing this conversation is about (null for direct messages)
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
      default: null,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientName: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

messageSchema.index({ model: 1, sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, read: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
