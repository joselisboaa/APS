import { Router } from "express";
import { UserGroupController } from "../controllers/userGroupController";
import { requestBodyValidator } from "../middlewares/json/requestBodyValidator"
import { userGroupSchema } from "../middlewares/json/schemas/userGroupSchema";
import * as userGroupErrorHandler from "../middlewares/exceptions/userGroupErrorHandler";
export const userGroupRouter = new Router();

import { MainController } from "../controllers/mainController";
import { verifyUserAuth } from "../middlewares/exceptions/authError";

userGroupRouter.get("/",
    MainController.findAll
)

userGroupRouter.post("/",
    verifyUserAuth(),
    requestBodyValidator(userGroupSchema),
    MainController.create
)

userGroupRouter.get("/:id",
    verifyUserAuth(),
    userGroupErrorHandler.exists(false, false),
    MainController.findById
)

userGroupRouter.delete("/:id",
    verifyUserAuth(),
    userGroupErrorHandler.exists(false, false),
    userGroupErrorHandler.verifyEntityDependencies(),
    MainController.deleteById
)

userGroupRouter.put("/:id",
    verifyUserAuth(),
    requestBodyValidator(userGroupSchema),
    userGroupErrorHandler.exists(false, false),
    MainController.update
)
