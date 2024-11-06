import { Router } from "express";
import { requestBodyValidator } from "../middlewares/json/requestBodyValidator"
import { answerSchema } from "../middlewares/json/schemas/answerSchema";
import * as answerErrorHandler from "../middlewares/exceptions/answerErrorHandler";
import * as questionErrorHandler from "../middlewares/exceptions/questionErrorHandler";

import { MainController } from "../controllers/mainController";
import { verifyUserAuth } from "../middlewares/exceptions/authError";


export const answerRouter = new Router();

answerRouter.get("/",
    verifyUserAuth(),
    MainController.findAll
)

answerRouter.post("/",
    verifyUserAuth(),
    requestBodyValidator(answerSchema),
    questionErrorHandler.exists(true),
    answerErrorHandler.verifyRepeatedData(),
    MainController.create
)

answerRouter.get("/:id",
    verifyUserAuth(),
    answerErrorHandler.exists(false, false),
    MainController.findById
)

answerRouter.delete("/:id",
    verifyUserAuth(),
    answerErrorHandler.exists(false, false),
    answerErrorHandler.verifyEntityDependencies(),
    MainController.deleteById
)

answerRouter.put("/:id",
    verifyUserAuth(),
    requestBodyValidator(answerSchema),
    answerErrorHandler.exists(false, false),
    questionErrorHandler.exists(true),
    answerErrorHandler.verifyRepeatedData(),
    MainController.update
)
