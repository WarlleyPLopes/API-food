const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const DishesController = require("../controllers/DishesController")
const DishesImageController = require("../controllers/DishesImageController")

const ensureAuthenticatedAdmin = require("../middlewares/ensureAuthenticatedAdmin")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const dishesRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const dishesController = new DishesController()
const dishesImageController = new DishesImageController()

dishesRoutes.use(ensureAuthenticated)

dishesRoutes.post("/", ensureAuthenticatedAdmin, dishesController.create)
dishesRoutes.put("/:id", ensureAuthenticatedAdmin, dishesController.update)
dishesRoutes.delete("/:id", ensureAuthenticatedAdmin, dishesController.delete)
dishesRoutes.get("/", dishesController.index)
dishesRoutes.get("/:id", dishesController.show)
dishesRoutes.patch(
  "/image/:id",
  ensureAuthenticatedAdmin,
  upload.single("image"),
  dishesImageController.update
)

module.exports = dishesRoutes