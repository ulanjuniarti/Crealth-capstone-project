const { PrismaClient } = require('@prisma/client');

let prisma;

const getPrismaClient = () => {
    if (!prisma) {
        prisma = new PrismaClient();
    }
    return prisma;
};

module.exports = { getPrismaClient };
