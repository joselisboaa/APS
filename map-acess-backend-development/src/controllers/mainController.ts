import { AnswerService } from "../services/answerService.js"


export class MainController {
    static async findAll(req, res) {
        if (req.baseUrl === "/answers") {
            const teste = new AnswerService();
            
            res.send(await teste.findAll(req, res));
        }
    }
}