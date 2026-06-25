import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10); // Password: admin123

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sirat.ai' },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@sirat.ai',
      name: 'Admin Shahbaz',
      role: 'ADMIN',
      password: hashedPassword,
    },
  });
  console.log('Admin user updated/created with password: admin123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });