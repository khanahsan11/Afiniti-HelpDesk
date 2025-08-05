import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      return getUserById(req, res, id as string);
    case 'PUT':
      return updateUser(req, res, id as string);
    case 'DELETE':
      return deleteUser(req, res, id as string);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getUserById(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user' });
  }
}

async function updateUser(req: NextApiRequest, res: NextApiResponse, id: string) {
  const { name, email, password, role } = req.body;
  
  try {
    const updateData: any = { name, email, role };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: 'Error updating user' });
  }
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    return res.status(204).end();
  } catch (error) {
    return res.status(400).json({ message: 'Error deleting user' });
  }
}