import { Category, PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { REST } from '../../@common/@enums';

const prisma = new PrismaClient();

export default async function categoriesApi(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    const method = req.method;
    if (process.env.MOCK_ATH === 'true' || session) {
      if (method === REST.GET) {
        const categories = await prisma.category.findMany();
        return res.status(200).json(categories);
      }

      const user = await prisma.user.findUnique({ where: { email: session?.user?.email || undefined } });
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (method === REST.POST) {
        const { body }: { body: Category } = req;
        // const newCategory: Category = {
        //   ...body,
        //   user:
        // };
        console.log(body);
        const category = await prisma.category.create({ data: { title: body.title, description: body.description, user: { connect: { id: user.id } } } });
        return res.status(200).json(category);
      }
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}
