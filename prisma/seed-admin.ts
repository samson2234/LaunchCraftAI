import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@launchcraft.ai";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";

    const hashedPassword = await hash(adminPassword, 10);

    const user = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            role: "ADMIN",
        },
        create: {
            email: adminEmail,
            name: "Super Admin",
            password: hashedPassword,
            role: "ADMIN",
            subscription: {
                create: {
                    plan: "GROWTH",
                    status: "ACTIVE",
                },
            },
        },
    });

    console.log(`Admin user ensured: ${user.email}`);
    console.log(`Password: ${adminPassword}`);
    console.log("You can now log in at /login with these credentials.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
