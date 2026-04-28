const prisma = require("../config/prisma");

const addItem = async (req, res) => {
  try {
    const item = await prisma.item.create({
      data: {
        userId: req.user.id,
        companyId: Number(req.body.companyId),
        itemName: req.body.itemName,
        brandName: req.body.brandName,
        hsnCode: req.body.hsnCode,
        unit: req.body.unit,
        salePrice: Number(req.body.salePrice || 0),
        purchasePrice: Number(req.body.purchasePrice || 0),
        stockQty: Number(req.body.stockQty || 0),
      },
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getItems = async (req, res) => {
  try {
    const { companyId } = req.query;

    const items = await prisma.item.findMany({
      where: {
        userId: req.user.id,
        companyId: Number(companyId),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateItem = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const updated = await prisma.item.updateMany({
      where: {
        id,
        userId: req.user.id,
      },
      data: {
        ...req.body,
        companyId: req.body.companyId ? Number(req.body.companyId) : undefined,
      },
    });

    if (!updated.count) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    const item = await prisma.item.findUnique({
      where: { id },
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const deleted = await prisma.item.deleteMany({
      where: {
        id: Number(req.params.id),
        userId: req.user.id,
      },
    });

    if (!deleted.count) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.json({
      message: "Item deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addItem,
  getItems,
  updateItem,
  deleteItem,
};
