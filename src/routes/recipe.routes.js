const Router = require("express").Router;
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipeById,
  deleteRecipeById,
} = require("../controllers/recipeController.js");
const auth = require("../middleware/auth.middleware.js");
const restrictToOwner = require("../middleware/restrictToOwner.js");

const recipeRouter = Router();

recipeRouter.post("/", auth, createRecipe);
recipeRouter.get("/", getAllRecipes);
recipeRouter.get("/:recipeId", auth, getRecipeById);
recipeRouter.put("/:recipeId", auth, restrictToOwner, updateRecipeById);
recipeRouter.delete("/:recipeId", auth, restrictToOwner, deleteRecipeById);

module.exports = recipeRouter;
