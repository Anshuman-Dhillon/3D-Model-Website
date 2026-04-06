import express from "express";
import { getAllModels, getModelById, createModel, updateModel, deleteModel, searchModels, downloadModel, previewModel } from "../controllers/modelFunctions.js";
import { addCart, removeCart, getAllCart, userGetAllModels, personalInfoChange, notificationChange, getProfile, uploadProfilePicture } from "../controllers/userFunctions.js";
import { checkout, getTransactions, stripeWebhook, confirmCheckout } from "../controllers/payments.js";
import { getAllUsers, getUserById, deleteUser, discoverUsers } from "../controllers/userHelpers.js";
import { submitSupportMessage } from "../controllers/support.js";
import { createUser } from "../controllers/userSignUp.js";
import { logInUser, refreshAccessToken, logOutUser } from "../controllers/userLogIn.js";
import { googleAuth } from "../controllers/googleLogIn.js";
import {
  getReviews, createReview, getQuestions, createQuestion, createAnswer,
  toggleLike, getLikedModels, toggleFollow, sendMessage, getConversations, getThread,
} from "../controllers/community.js";
import authenticated from "../middleware/authentication.js";
import upload from "../middleware/upload.js";

const router = express.Router();
// ==================== AUTH ROUTES (public) ====================
router.post("/auth/signup", createUser);
router.post("/auth/login", logInUser);
router.post("/auth/google", googleAuth);
router.post("/auth/refresh", refreshAccessToken);
router.post("/auth/logout", logOutUser);

// ==================== MODEL ROUTES (public) ====================
router.get("/models", getAllModels);
router.get("/models/search", searchModels);
router.get("/models/:id/preview", previewModel);
router.get("/models/:id", getModelById);

// ==================== USER ROUTES (public profile) ====================
router.get("/users/discover", discoverUsers);
router.get("/users/:id", getUserById);

// ==================== SUPPORT (public) ====================
router.post("/support", submitSupportMessage);

// ==================== COMMUNITY (public reads) ====================
router.get("/models/:id/reviews", getReviews);
router.get("/models/:id/questions", getQuestions);

// ==================== AUTHENTICATED ROUTES ====================
router.use(authenticated);

// -- Models (authenticated) --
router.post("/models", upload.fields([
    { name: "modelFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
]), createModel);

router.put("/models/:id", upload.fields([
    { name: "modelFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
]), updateModel);

router.delete("/models/:id", deleteModel);
router.get("/models/:id/download", downloadModel);

// -- Cart --
router.get("/cart", getAllCart);
router.post("/cart/:modelId", addCart);
router.delete("/cart/:modelId", removeCart);

// -- User Profile & Settings --
router.get("/user/profile", getProfile);
router.get("/user/models", userGetAllModels);
router.patch("/user/settings", personalInfoChange);
router.patch("/user/notifications", notificationChange);
router.put("/user/profile-picture", upload.single("profilePicture"), uploadProfilePicture);
router.delete("/user/account", deleteUser);

// ==================== ADMIN / AUTH USERS ====================
router.get("/users", getAllUsers);

// ==================== TRANSACTIONS ====================
router.post("/transactions/checkout", checkout);
router.post("/transactions/confirm", confirmCheckout);
router.get("/transactions", getTransactions);

// ==================== COMMUNITY (authenticated) ====================
router.post("/models/:id/reviews", createReview);
router.post("/models/:id/questions", createQuestion);
router.post("/questions/:id/answers", createAnswer);
router.post("/models/:id/like", toggleLike);
router.get("/user/likes", getLikedModels);
router.post("/users/:id/follow", toggleFollow);

// -- Messaging --
router.post("/messages", sendMessage);
router.get("/messages/conversations", getConversations);
router.get("/messages/:modelId/:userId", getThread);

export default router;