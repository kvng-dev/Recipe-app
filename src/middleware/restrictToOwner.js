const Recipe = require("../model/recipe.model");

module.exports = async (req, res, next) => {
  const { recipeId } = req.params;
  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    return res.status(404).json({
      status: "error",
      message: `Recipe id ${recipeId} is invalid`,
    });
  }

  if (!recipe || String(recipe.createdBy) !== String(req.user._id)) {
    return res.status(403).json({
      status: "error",
      message: "Forbidden Route",
    });
  }

  next();
};
