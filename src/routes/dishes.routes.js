const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const DishesController = require("../controllers/DishesController")
const DishesImageController = require("../controllers/DishesImageController")

const dishesRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const dishesController = new DishesController()
const dishesImageController = new DishesImageController()

dishesRoutes.post("/", dishesController.create)
dishesRoutes.get("/", dishesController.index)
dishesRoutes.get("/:id", dishesController.show)
dishesRoutes.delete("/:id", dishesController.delete)
dishesRoutes.patch(
  "/image/:id",
  upload.single("image"),
  dishesImageController.update
)

module.exports = dishesRoutes