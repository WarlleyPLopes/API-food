const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const DishesController = require("../controllers/DishesController")

const ensureAuthenticatedAdmin = require("../middlewares/ensureAuthenticatedAdmin")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const dishesRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const dishesController = new DishesController()

dishesRoutes.use(ensureAuthenticated)

dishesRoutes.post("/", ensureAuthenticatedAdmin, upload.single("image"), dishesController.create);
dishesRoutes.put("/:id", ensureAuthenticatedAdmin, dishesController.update)
dishesRoutes.delete("/:id", ensureAuthenticatedAdmin, dishesController.delete)
dishesRoutes.get("/", dishesController.index)
dishesRoutes.get("/:id", dishesController.show)

module.exports = dishesRoutes