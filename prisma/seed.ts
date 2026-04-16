import { PrismaClient, TaskStatus } from "@prisma/client";

import { createOwnerHash } from "@/lib/community";

function getDatabaseName(databaseUrl: string | undefined) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required before seeding.");
  }

  return new URL(databaseUrl).pathname.replace(/^\//, "");
}

function assertAgentDatabase() {
  const databaseName = getDatabaseName(process.env.DATABASE_URL);
  const agentId = process.env.AGENT_ID;

  if (!agentId) {
    throw new Error("AGENT_ID is required before seeding. Run `npm run agent:init` first.");
  }

  if (databaseName === "dugnadapp" || databaseName === "postgres") {
    throw new Error(
      `Refusing to seed shared database "${databaseName}". Run \`npm run agent:init\` to provision an isolated database first.`,
    );
  }

  if (databaseName.includes("shadow")) {
    throw new Error(`Refusing to seed shadow database "${databaseName}".`);
  }
}

assertAgentDatabase();

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.community.deleteMany();

  await prisma.community.create({
    data: {
      name: "Maple Street Neighbourhood",
      slug: "maple-street",
      ownerHash: createOwnerHash("maple.street@example.com"),
      eventDate: new Date("2027-06-01T00:00:00.000Z"),
      description: "En enkel eksempeldugnad som fortsatt driver startsiden lokalt.",
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
