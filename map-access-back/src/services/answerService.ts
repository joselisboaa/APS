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
    
    if (!isNaN(questionId)) {
      filter["question"] = {
        id: Number(queryParam["question-id"]) 
      };
    }
    const query = {
      skip: queryParam["pg"] == null ? 0 : (Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1)),
      take: queryParam["qt"] == null ? 100 : Number(queryParam["qt"]),
      where: filter,
      include: {
        question: true, 
        orientations: true
      }
    };

    const answers = await prisma.answer.findMany(query);
    const formattedAnswers = answers.map(answer => ({
      id: answer.id,
      text: answer.text,
      other: answer.other,
      question: answer.question, 
      orientations: answer.orientations 
    }));

    return formattedAnswers;
  }

  async findById(id) {
    return prisma.answer.findUnique({
      where: {
      id: id,
      },
    
      include: {
        question: true, 
        orientations: true 
      }
    });
  }

  async create(data) {
    return prisma.answer.create({
      data: {
        text: data["text"],
        other: data["other"],
        question: {
          connect: { id: data["question_id"] } 
        },
        orientations: {
          create: data["orientations"].map((orientation) => ({
          text: orientation.text,
          value: orientation.value,
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
    "question_id": req.body["question_id"],
    "orientations": req.body["orientations"]
    };

    return prisma.answer.update({
    where: {
    id: data["id"],
    },
    data: {
      text: data["text"],
      other: data["other"],
      question: {
        connect: { id: data["question_id"] } 
      },
      orientations: {
        set: data["orientations"].map((orientation) => ({
        text: orientation.text,
        value: orientation.value
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