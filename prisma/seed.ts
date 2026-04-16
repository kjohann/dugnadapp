import { PrismaClient, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.community.deleteMany();

  await prisma.community.create({
    data: {
      name: "Maple Street Neighbourhood",
      slug: "maple-street",
      tasks: {
        create: [
          {
            title: "Refresh the shared flower beds",
            description:
              "Bring fresh soil and plant spring flowers near the entrance sign.",
            status: TaskStatus.TODO,
          },
          {
            title: "Repair the playground bench",
            description:
              "Sand the loose plank, tighten the bolts, and repaint the frame.",
            status: TaskStatus.IN_PROGRESS,
          },
          {
            title: "Collect litter along the walking path",
            description:
              "A simple cleanup round so the area looks ready for the weekend.",
            status: TaskStatus.DONE,
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
