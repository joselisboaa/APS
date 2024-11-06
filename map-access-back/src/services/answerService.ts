import { Answer, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnswerService {
  async verifyEntityDependencies(req, res): Promise<Answer | null> {
    const answerId = Number(req.params["id"]);

    const query = {
      where: { id: answerId },
      include: { orientations: true }
    }

    return prisma.answer.findFirst(query);
  }

  async verifyUniqueProperties(req): Promise<Answer | null> {
    const body = req.body;

    const query = {
      where: {
        text: body["text"]
      }
    }

    return prisma.answer.findFirst(query);
  }

  async findAll(req, res) {
    const queryParam = req.query;
  
    let filter = {
      text: {
        startsWith: queryParam["text"]
      }
    };
  
    const questionId = queryParam["question-id"];
    if (isNaN(questionId) === false) {
      filter["questions"] = {
        some: {
          questionId: Number(queryParam["question-id"])
        }
      };
    }
  
    const query = {
      skip: queryParam["pg"] == null ? 0 : (Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1)),
      take: queryParam["qt"] == null ? 100 : Number(queryParam["qt"]),
      where: filter,
      include: {
        questions: {
          include: {
            question: true
          }
        }
      }
    };
  
    const answers = await prisma.answer.findMany(query);
  
    const formattedAnswers = answers.map(answer => ({
      id: answer.id,
      text: answer.text,
      other: answer.other,
      questions: answer.questions.map(q => q.question)
    }));
  
    return formattedAnswers;
  }
  

  async findById(id) {
    return prisma.answer.findUnique({
      where: {
        id: id,
      },
    });
  }

  async create(data) {
    return prisma.answer.create({
      data: {
        text: data["text"],
        other: data["other"],
        questions: {
          create: data["question_ids"].map((questionId) => ({
            question: {
              connect: { id: questionId }
            }
          }))
        }
      }
    });
  }

  async update(req, res) {
    const data = {
      "id": res.locals.answer["id"],
      "text": req.body["text"],
      "other": req.body["other"],
      "question_ids": req.body["question_ids"]
    };

    return prisma.answer.update({
      where: {
        id: data["id"],
      },
      data: {
        text: data["text"],
        other: data["other"],
        questions: {
          set: data["question_ids"].map((questionId) => ({
            questionId
          }))
        }
      }
    });
  }

  async deleteById(data) {
    return prisma.answer.delete({
      where: {
        id: data["id"],
      },
    });
  }
}
