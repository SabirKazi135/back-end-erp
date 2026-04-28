const prisma = require("../config/prisma");

const addCompany = async (req, res) => {
  try {
    const company = await prisma.company.create({
      data: {
        userId: req.user.id,
        ...req.body,
      },
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(companies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const company = await prisma.company.updateMany({
      where: {
        id: Number(req.params.id),
        userId: req.user.id,
      },
      data: req.body,
    });

    if (!company.count) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const updated = await prisma.company.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addCompany,
  getCompanies,
  updateCompany,
};
