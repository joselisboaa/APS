import { PrismaClient, User } from '@prisma/client';
import { QuestionService } from './questionService';

const prisma = new PrismaClient();
const questionService = new QuestionService();

export class UserService {
    async verifyEntityDependencies(req, res): Promise<User | null> {
        const userId = Number(req.params["id"]);
    
        const query = {
          where: { id: userId },
          include: { responses: true }
        }
    
        return prisma.user.findFirst(query);
    }

    async verifyUniqueProperties(req): Promise<User | null> {
        const body = req.body;
    
        const query = {
          where: {
            OR: [
                { email: body["email"] },
                { phone_number: body["phone_number"] }
            ]
          }
        }
    
        return prisma.user.findFirst(query)
    }

    async findByEmail(email) {
        let filter = {
            email: {
                equals: email
            }
        }
        
        const query = {
            where: filter
        }

        return prisma.user.findFirst(query);
    }

    async findAll(req, res) {
        const queryParam = req.query

        let filter = {
            phone_number: {
                startsWith: queryParam["phone-number"]
            },
            email: {
                startsWith: queryParam["email"]
            }
        }

        const userGroupId = queryParam["user-group-id"]
        if (isNaN(userGroupId) === false) {
            filter["user_group_id"] = Number(queryParam["user-group-id"])
        }

        const query = {
            skip: queryParam["pg"] == null ? 0 : (Number(queryParam["qt"]) * (Number(queryParam["pg"]) - 1)),
            take: queryParam["qt"] == null ? 100 : Number(queryParam["qt"]),
            where: filter,
            include: {
                user_groups: true
            }
        }

        return prisma.user.findMany(query);
    }

    async findById(id) {
        return prisma.user.findUnique({
        where: {
            id: id,
        },
        include: {
            user_groups: true
        },
        });
    }

    async create(data) {
        const groupsIds = data["user_groups"];

        return prisma.user.create({
        data: {
            phone_number: data["phone_number"],
            user_groups: {
            connect: groupsIds,
            },
            email: data["email"],
            password: data["password"],
        },
        });
    }

    async update(req, res) {
        const data = {
            "id": res.locals.user["id"],
            "phone_number": req.body["phone_number"],
            "user_groups": req.body["user_groups"],
            "email": req.body["email"],
            "password": req.body["password"]
        }

        const setValue = data["user_groups"].map(({ id }) => ({ id }));

        return prisma.user.update({
        where: {
            id: data["id"],
        },
        data: {
            phone_number: data["phone_number"],
            user_groups: {
            set: setValue,
            },
            email: data["email"],
            password: data["password"],
        },
        });
    }

    async deleteById(data) {
        await prisma.user.update({
        where: {
            id: data["id"],
        },
        data: {
            user_groups: {
            set: [],
            },
        },
        });

        return prisma.user.delete({
        where: {
            id: data["id"],
        },
        });
    }

    async getUserFormByUserId(groups) {
        const formQuestions: any[] = [];
      
        for (const group of groups) {
            const query = {
                where: {
                  user_group_id: group.id,
                },
                include: {
                    answers: {
                        include: {
                            answer: {
                                select: {
                                    id: true,
                                    text: true,
                                    other: true,
                                },
                            },
                        },
                    },
                },
              };
              
          const groupQuestions = await questionService.getExecuteQuery(query);
      
          const formattedQuestions = groupQuestions.map((question: any) => ({
            id: question.id,
            text: question.text,
            user_group_id: question.user_group_id,
            answers: question.answers.map((qoa: any) => ({
              id: qoa.answer.id,
              text: qoa.answer.text,
              other: qoa.answer.other,
            })),
          }));
      
          formQuestions.push(...formattedQuestions);
        }
      
        return formQuestions;
      }
      
}