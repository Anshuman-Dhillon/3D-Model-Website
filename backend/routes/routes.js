import express from "express"
import { getAllModels, getModelById, createModel, updateModel, deleteModel, getAllUsers, getUserById, createUser, updateUser, deleteUser, addCart, removeCart, addTransaction, removeTransaction, transportModel } from "../controllers/controllers.js";

const router = express.Router();

// Model routes
router.get("/models", getAllModels);
router.get("/models/:id", getModelById);

router.post("/models", createModel);

router.put("/models/:id", updateModel);

router.delete("/models/:id", deleteModel);

// User routes
router.get("/users", getAllUsers);
router.get("/users/:userid", getUserById);

router.post("/users", createUser);

router.put("/users/:userid", updateUser);

router.delete("/users/:userid", deleteUser);

// User model routes
router.get("/users/add/:id", addCart);
router.get("/users/add/transaction/:id", addTransaction);

router.delete("/users/remove/:id", removeCart);
router.delete("/users/remove/transaction/:id", removeTransaction);

export default router;