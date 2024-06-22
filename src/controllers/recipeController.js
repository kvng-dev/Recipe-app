const Recipe = require("../model/recipe.model");

const createRecipe = async (req, res, next) => {
  try {
    // check to ensure the recipe title is unique
    const { title } = req.body;

    const foundRecipe = await Recipe.findOne({ title });

    if (foundRecipe) {
      // Duplicate recipe title
      return res.status(409).json({
        status: "error",
        message: `Recipe with title '${title}' already exists.`,
      });
    }

    // create a recipe object
    const newRecipe = new Recipe({
      title,
      description: req.body.description,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      servings: req.body.servings,
      prepTimeInMinutes: req.body.prepTimeInMinutes,
      cookTimeInMinutes: req.body.cookTimeInMinutes,
      numberOfServings: req.body.numberOfServings,
      category: req.body.category,
      cuisine: req.body.cuisine,
      difficulty: req.body.difficulty,
      image: req.body.image,
      createdBy: req.user._id,
    });

    // save to the db
    // await newRecipe.save();
    const recipe = await Recipe.create(newRecipe);

    // Return a 201 (created) response
    return res.status(201).json({
      status: "success",
      message: "Recipe created",
      data: recipe,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: "error", message: "Something went wrong" });
  }
};

const getAllRecipes = async (req, res, next) => {
  try {
    const {
      category,
      difficulty,
      title,
      cookingTimeLow,
      cookingTimeHigh,
      ingredients,
    } = req.query;
    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    if (title) {
      filter.title = new RegExp(title, "i");
    }
    if (ingredients) {
      filter.ingredients = ingredients;
    }
    if (cookingTimeLow) {
      filter.cookTimeInMinutes = { $gte: +cookingTimeLow };
    }

    if (cookingTimeHigh) {
      filter.cookTimeInMinutes = {
        ...(filter.cookTimeInMinutes || {}),
        $lte: +cookingTimeHigh,
      };
    }

    const recipes = await Recipe.find(filter);

    return res.status(200).json({
      status: "success",
      count: recipes.length,
      message: "Fetched Recipes successfully",
      data: recipes,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const getRecipeById = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({
        status: "error",
        message: `Recipe with the given id ${recipeId} does not exist`,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Fetched Recipe successfully",
      data: recipe,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const updateRecipeById = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, {
      new: true,
    });

    if (!updatedRecipe) {
      return res.status(404).json({
        status: "error",
        message: `Recipe with given id ${recipeId} was not found`,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Recipe Updated successfully",
      data: updatedRecipe,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const deleteRecipeById = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findByIdAndDelete(recipeId);

    if (!recipe) {
      return res.status(404).json({
        status: "error",
        message: `Recipe with the given id ${recipeId} does not exist`,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Recipe Deleted successfully",
      data: recipe,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipeById,
  deleteRecipeById,
};
