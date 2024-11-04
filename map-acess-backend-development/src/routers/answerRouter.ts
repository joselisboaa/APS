import { Router } from "express";
import { AnswerController } from "../controllers/answerController.js";
import { requestBodyValidator } from "../middlewares/json/requestBodyValidator.js"
import { answerSchema } from "../middlewares/json/schemas/answerSchema.js";
import * as answerErrorHandler from "../middlewares/exceptions/answerErrorHandler.js";
import * as questionErrorHandler from "../middlewares/exceptions/questionErrorHandler.js";

import { MainController } from "../controllers/mainController";


export const answerRouter = new Router();

answerRouter.get("/",
    MainController.findAll
)

answerRouter.post("/",
    requestBodyValidator(answerSchema),
    questionErrorHandler.exists(true),
    AnswerController.create
)

answerRouter.get("/:id",
    answerErrorHandler.exists(false),
    AnswerController.findById
)

answerRouter.delete("/:id",
    answerErrorHandler.exists(false),
    AnswerController.deleteById
)

answerRouter.put("/:id",
    requestBodyValidator(answerSchema),
    answerErrorHandler.exists(false),
    questionErrorHandler.exists(true),
    AnswerController.update
)
