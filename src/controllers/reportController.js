const prisma = require("../config/prisma");

const getSummary = async (req, res) => {
  try {
    const { companyId } = req.query;

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: req.user.id,
        companyId: Number(companyId),
        isDraft: false,
      },
      include: {
        items: true,
      },
    });

    const totalInvoices = invoices.length;

    const totalSales = invoices.reduce(
      (sum, inv) => sum + Number(inv.grandTotal || 0),
      0,
    );

    const totalQty = invoices.reduce((sum, inv) => {
      const qty = inv.items.reduce((a, b) => a + Number(b.qty || 0), 0);

      return sum + qty;
    }, 0);

    res.json({
      totalInvoices,
      totalSales,
      totalQty,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getInvoiceReport = async (req, res) => {
  try {
    const { companyId } = req.query;

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: req.user.id,
        companyId: Number(companyId),
        isDraft: false,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getItemReport = async (req, res) => {
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

module.exports = {
  getSummary,
  getInvoiceReport,
  getItemReport,
};
