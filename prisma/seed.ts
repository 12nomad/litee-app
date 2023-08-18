import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const landscapePosts = [
  {
    description: 'Grimentz, Switzerland',
    media:
      'https://images.unsplash.com/photo-1594069758873-e79e9075eb7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=720',
    userId: 1,
  },
  {
    description: 'Tokyo, Japan',
    media:
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=720',
    userId: 1,
  },
  {
    description: 'Cranbrook, BC, Canada',
    media:
      'https://plus.unsplash.com/premium_photo-1672116453031-cc6b6f8db603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=720',
    userId: 1,
  },
  {
    description: 'Porvoo, Finland',
    media:
      'https://images.unsplash.com/photo-1578054320988-a2ac16f42591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=720',
    userId: 1,
  },
  {
    description: 'Seoul, South Korea',
    media:
      'https://images.unsplash.com/photo-1583833008338-31a6657917ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=720',
    userId: 1,
  },
];

const techPosts = [
  {
    description:
      'Valve’s Steam Deck released one year ago. In that time, this portable gaming computer has seen major monthly upgrades that bring new interface tweaks and features. From its massive game library to its impressive performance, this little PC has only gotten better with age.',
    media:
      'https://images.unsplash.com/photo-1653757581649-b61a69744115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=720',
    userId: 2,
  },
  {
    description:
      'OpenAI GPT-4 has been successful in passing exams and completing assignments. Compared to GPT-3.5, GPT-4 has vastly improved in biology and statistics exams and the LSATs, achieving scores above the top 80% of test takers.',
    media:
      'https://images.unsplash.com/photo-1591696331111-ef9586a5b17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=720',
    userId: 2,
  },
  {
    description:
      "For 2023, Samsung has refined its flagship smartphone; the Galaxy S23 Ultra. With a slightly tweaked design, a new 200MP camera, and impressive battery life, it's hard to ignore how capable this phone is for users who demand the best of the best.",
    media:
      'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=720',
    userId: 2,
  },
];

const randomPost = [
  {
    description: 'Peace at last...',
    media:
      'https://images.unsplash.com/photo-1682695798522-6e208131916d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=720',
    userId: 3,
  },
  {
    description: 'A night to remember...',
    media:
      'https://images.unsplash.com/photo-1559060680-36abfac01944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=720',
    userId: 3,
  },
];

async function main() {
  const hashed = await argon.hash('qwerty123456');
  for (let i = 0; i < 3; i++) {
    await prisma.user.create({
      data: {
        password: hashed,
        email: faker.internet.email(),
        description: faker.person.bio(),
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        profileImage: faker.image.avatar(),
        profileBackgroundImage: '',
      },
    });
  }

  landscapePosts.forEach(
    async (el) =>
      await prisma.post.create({
        data: {
          description: el.description,
          media: el.media,
          userId: el.userId,
        },
      }),
  );

  techPosts.forEach(
    async (el) =>
      await prisma.post.create({
        data: {
          description: el.description,
          media: el.media,
          userId: el.userId,
        },
      }),
  );

  randomPost.forEach(
    async (el) =>
      await prisma.post.create({
        data: {
          description: el.description,
          media: el.media,
          userId: el.userId,
        },
      }),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
