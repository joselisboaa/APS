import { PrismaClient } from '@prisma/client';
import { QuestionService, AnswerService } from './';
import { UserGroupService } from './userGroupService';
import { OrientationService } from './orientationService';

const prisma = new PrismaClient();
const questionService = new QuestionService();
const answerService = new AnswerService();
const groupService = new UserGroupService();
const orientationService = new OrientationService();

export class ResponseService {
  async findAll(req, res) {
    const queryParam = req.query

      let filter = {}

      const orientationId = queryParam["orientation-id"]
      if (isNaN(orientationId) === false) {
          filter["orientation_id"] = Number(queryParam["orientation-id"])
      }

      const userId = queryParam["user-id"]
      if (isNaN(userId) === false) {
          filter["user_id"] = Number(queryParam["user-id"])
      }

      const query = {
          skip: queryParam["pg"] == null ? 0 : (Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1)),
          take: queryParam["qt"] == null ? 100 : Number(queryParam["qt"]),
          where: filter,
          include: {
              orientations: true
          }
      }

    return prisma.response.findMany(query);
  }

  async findById(id) {
    return prisma.response.findUnique({
      where: {
        id: id,
      },
      include: {
        orientations: true,
      },
    });
  }

  async create(reqData) {
    const answers = reqData["answers"]
    let orientations: any[] = []
    for (let i = 0; i < answers.length; i++) {
        if (answers[i]["other"] === true) {
            let currentAnswer = reqData["other_answers"][`content_${answers[i]["id"]}`]
            let newOrientation =
                await orientationService.create({
                "text": currentAnswer["text"],
                "value": 0,
                "answer_id": answers[i]["id"]
            })
            orientations.push({"id": newOrientation["id"]})
        }
        if(answers[i]["other"] === false) {
            let orientation = await orientationService.findByAnswer(answers[i]["id"])
            if (orientation) {
                orientations.push({"id": orientation["id"]})
            }
        }
    }
    const data = {
        "user_id": reqData["user_id"],
        "orientations": orientations
    }

    return prisma.response.create({
      data: {
        timestamp: new Date(),
        orientations: {
          connect: data["orientations"],
        },
        user_id: data["user_id"],
      },
    });
  }

  async update(req, res) {
    const answers = req.body["answers"]
    let orientations: any = []
    for (let i = 0; i < answers.length; i++) {
        if (answers[i]["other"] === true) {
            let currentAnswer = req.body["other_answers"][`content_${answers[i]["id"]}`]
            let otherOrientation =
                await orientationService.findByAnswer(answers[i]["id"])
            // Verificar se o texto na "Outra resposta" foi modificado, para criar ou não uma nova orientação
            if (otherOrientation && currentAnswer["text"] !== otherOrientation["text"]) {
                let newOrientation =
                    await orientationService.create({
                        "text": currentAnswer["text"],
                        "value": 0,
                        "answer_id": answers[i]["id"]
                    })
                orientations.push({"id": newOrientation["id"]})
                await orientationService.deleteById({"id": Number(otherOrientation["id"])})
            }
            if (otherOrientation && currentAnswer["text"] === otherOrientation["text"]) {
                orientations.push({"id": otherOrientation["id"]})
            }
        }
        if(answers[i]["other"] === false) {
            let orientation = await orientationService.findByAnswer(answers[i]["id"])
            if(orientation) {
                orientations.push({"id": orientation["id"]})
            }
        }
    }
    const data = {
        "id": res.locals.responseReport["id"],
        "user_id": req.body["user_id"],
        "orientations": orientations
    }
    const setValue = data["orientations"].map(({ id }) => ({ id }));

    return prisma.response.update({
      where: {
        id: data["id"],
      },
      data: {
        timestamp: new Date(),
        orientations: {
          set: setValue,
        },
        user_id: data["user_id"],
      },
    });
  }

  async deleteById(data) {
    // Remove the relationship between response and orientations before deleting the response
    await prisma.response.update({
      where: {
        id: data["id"],
      },
      data: {
        orientations: {
          set: [],
        },
      },
    });

    return prisma.response.delete({
      where: {
        id: data["id"],
      },
    });
  }

  async sendReport(responseReport) {

    let jsonData = {
        id: responseReport["id"],
        timestamp: responseReport["timestamp"],
        orientations:{}
    }

    for (let i = 0; i < responseReport.orientations.length; i++) {
        let currentAnswer = await answerService.findById(responseReport.orientations[i].answer_id)
        let currentQuestion;

        if (currentAnswer) {
            currentQuestion = await questionService.findById(currentAnswer["question_id"])
        }

        let currentGroup: any = await groupService.findById(currentQuestion["user_group_id"])

        if (!(currentGroup["text"] in jsonData.orientations)) {
            jsonData.orientations[`${currentGroup["text"]}`] = {
                "questions":[],
                "value": 0,
            }
        }

        if (currentAnswer) {
            jsonData.orientations[`${currentGroup["text"]}`]["questions"].push({
                "text": currentQuestion["text"],
                "answer": currentAnswer["text"],
                "orientation": responseReport.orientations[i].text
            })
        }

        jsonData.orientations[`${currentGroup["text"]}`]["value"] += responseReport.orientations[i]["value"]
    }

    return jsonData;
}
}
