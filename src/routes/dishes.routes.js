const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const DishesController = require("../controllers/DishesController")
const DishImageController = require("../controllers/DishImageController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const ensureAuthenticatedAdmin = require("../middlewares/ensureAuthenticatedAdmin")

const dishesController = new DishesController()
const dishImageController = new DishImageController()

const dishesRoutes = Router()
const upload = multer(uploadConfig.MULTER)

dishesRoutes.use(ensureAuthenticated)

dishesRoutes.post("/", ensureAuthenticatedAdmin, upload.single("image"), dishesController.create);
dishesRoutes.put("/:id", ensureAuthenticatedAdmin, dishesController.update)
dishesRoutes.patch("/image/:id", ensureAuthenticatedAdmin, upload.single("image"), dishImageController.update);
dishesRoutes.delete("/:id", ensureAuthenticatedAdmin, dishesController.delete);

dishesRoutes.get("/", dishesController.index);
dishesRoutes.get("/:id", dishesController.show);

module.exports = dishesRoutes