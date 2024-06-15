const { getPrismaClient } = require('../db/index');
const { predictDisease } = require('../utils/predictDisease');

const prisma = getPrismaClient();

const diagnose = async (req, res) => {
    const { symptoms } = req.body;

    try {
        const { disease, description, prevention } = await predictDisease(symptoms);

        const diagnosis = await prisma.diagnosis.create({
            data: {
                symptoms: JSON.stringify(symptoms),
                disease,
                description,
                prevention: prevention.join(', ')
            }
        });

        res.json(diagnosis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { diagnose };
