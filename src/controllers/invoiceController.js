const prisma = require("../config/prisma");

const createInvoice = async (req, res) => {
  try {
    const {
      companyId,
      billNo,
      customerName,
      address,
      mobile,
      billDate,
      items,
      subtotal,
      grandTotal,
      isDraft,
    } = req.body;

    const invoice = await prisma.invoice.create({
      data: {
        userId: req.user.id,
        companyId: Number(companyId),
        billNo,
        customerName,
        address,
        mobile,
        billDate,
        subtotal: Number(subtotal || 0),
        grandTotal: Number(grandTotal || 0),
        isDraft: Boolean(isDraft),

        items: {
          create: (items || []).map((row) => ({
            itemId: String(row.itemId || ""),
            itemName: row.itemName,
            qty: Number(row.qty || 0),
            rate: Number(row.rate || 0),
            amount: Number(row.amount || 0),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getInvoices = async (req, res) => {
  try {
    const { companyId, draft } = req.query;

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: req.user.id,
        companyId: Number(companyId),
        isDraft: draft === "true",
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

const updateInvoice = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.invoiceItem.deleteMany({
      where: {
        invoiceId: id,
      },
    });

    const invoice = await prisma.invoice.update({
      where: {
        id,
      },
      data: {
        companyId: Number(req.body.companyId),
        billNo: req.body.billNo,
        customerName: req.body.customerName,
        address: req.body.address,
        mobile: req.body.mobile,
        billDate: req.body.billDate,
        subtotal: Number(req.body.subtotal || 0),
        grandTotal: Number(req.body.grandTotal || 0),
        isDraft: Boolean(req.body.isDraft),

        items: {
          create: (req.body.items || []).map((row) => ({
            itemId: String(row.itemId || ""),
            itemName: row.itemName,
            qty: Number(row.qty || 0),
            rate: Number(row.rate || 0),
            amount: Number(row.amount || 0),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.json(invoice);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: Number(req.params.id),
        userId: req.user.id,
      },
      include: {
        items: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    await prisma.invoice.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      message: "Invoice deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  updateInvoice,
  getInvoiceById,
  deleteInvoice,
};
