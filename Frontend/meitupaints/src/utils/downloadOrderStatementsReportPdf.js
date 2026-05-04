import jsPDF from "jspdf";

function safe(value) {
  return value === null || value === undefined || value === ""
    ? "-"
    : String(value);
}

function money(value, currency = "NPR") {
  return `${currency} ${Number(value || 0).toLocaleString()}`;
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function cleanFilename(value) {
  return safe(value)
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function groupOrdersByDealer(items = []) {
  const groups = new Map();

  for (const order of items) {
    const dealerName = order?.dealer?.companyName || "Unknown Dealer";
    const key = String(order?.dealer?._id || dealerName);

    if (!groups.has(key)) {
      groups.set(key, {
        dealer: order?.dealer || { companyName: dealerName },
        orders: [],
        total: 0,
        subtotal: 0,
      });
    }

    const group = groups.get(key);
    group.orders.push(order);
    group.subtotal += Number(order?.totals?.subtotal || 0);
    group.total += Number(order?.totals?.total || 0);
  }

  return Array.from(groups.values()).sort((a, b) =>
    String(a.dealer?.companyName || "").localeCompare(
      String(b.dealer?.companyName || ""),
    ),
  );
}

export async function downloadOrderStatementsReportPdf({ report, title }) {
  if (!report) return;

  const items = Array.isArray(report.items) ? report.items : [];
  const groups = groupOrdersByDealer(items);
  const currency = report?.totals?.currency || "NPR";
  const fromLabel = formatDate(report?.filters?.from);
  const toLabel = formatDate(report?.filters?.to);
  const reportTitle = title || "Order Statements Report";

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 36;
  const footerY = pageHeight - 18;
  const usableBottom = pageHeight - 42;
  const contentWidth = pageWidth - marginX * 2;

  const brand = {
    red: [181, 28, 28],
    redDark: [137, 17, 17],
    redSoft: [229, 62, 62],
    ink: [15, 23, 42],
    muted: [100, 116, 139],
    line: [226, 232, 240],
    softBg: [248, 250, 252],
    white: [255, 255, 255],
  };

  let y = 0;
  let page = 1;

  function setFont({ size = 10, bold = false, color = brand.ink } = {}) {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
  }

  function addText(text, x, yy, options = {}) {
    setFont(options);
    doc.text(text, x, yy, {
      align: options.align || "left",
      maxWidth: options.maxWidth,
    });
  }

  function footer() {
    doc.setDrawColor(...brand.line);
    doc.line(marginX, pageHeight - 32, pageWidth - marginX, pageHeight - 32);
    addText(`Generated ${formatDateTime(new Date())}`, marginX, footerY, {
      size: 8,
      color: brand.muted,
    });
    addText(`Page ${page}`, pageWidth - marginX, footerY, {
      size: 8,
      color: brand.muted,
      align: "right",
    });
  }

  function header(firstPage = false) {
    if (firstPage) {
      doc.setFillColor(...brand.redDark);
      doc.rect(0, 0, pageWidth, 86, "F");
      doc.setFillColor(...brand.redSoft);
      doc.rect(0, 86, pageWidth, 5, "F");

      addText("Meitu Construction Materials Pvt. Ltd.", marginX, 34, {
        size: 18,
        bold: true,
        color: brand.white,
      });
      addText(reportTitle, marginX, 62, {
        size: 11,
        bold: true,
        color: [255, 236, 236],
      });
      addText(`${fromLabel} to ${toLabel}`, pageWidth - marginX, 36, {
        size: 11,
        bold: true,
        color: brand.white,
        align: "right",
      });
      addText("Admin reporting document", pageWidth - marginX, 60, {
        size: 9,
        color: [255, 236, 236],
        align: "right",
      });
      y = 116;
      return;
    }

    doc.setFillColor(...brand.softBg);
    doc.rect(0, 0, pageWidth, 46, "F");
    addText(reportTitle, marginX, 27, {
      size: 11,
      bold: true,
    });
    addText(`${fromLabel} to ${toLabel}`, pageWidth - marginX, 27, {
      size: 9,
      color: brand.muted,
      align: "right",
    });
    y = 66;
  }

  function newPage() {
    footer();
    doc.addPage();
    page += 1;
    header(false);
  }

  function ensureSpace(height = 40) {
    if (y + height > usableBottom) {
      newPage();
    }
  }

  function drawSummary() {
    const cards = [
      {
        label: "Orders",
        value: Number(report?.totals?.orderCount || 0).toLocaleString(),
      },
      {
        label: "Dealers",
        value: Number(report?.totals?.dealerCount || 0).toLocaleString(),
      },
      {
        label: "Total Value",
        value: money(report?.totals?.total, currency),
      },
      {
        label: "Average Order",
        value: money(
          Number(report?.totals?.orderCount || 0)
            ? Number(report?.totals?.total || 0) /
                Number(report?.totals?.orderCount || 1)
            : 0,
          currency,
        ),
      },
    ];

    const gap = 10;
    const cardWidth = (contentWidth - gap * (cards.length - 1)) / cards.length;
    const cardHeight = 58;

    cards.forEach((card, index) => {
      const x = marginX + index * (cardWidth + gap);
      doc.setFillColor(...brand.softBg);
      doc.setDrawColor(...brand.line);
      doc.roundedRect(x, y, cardWidth, cardHeight, 8, 8, "FD");

      addText(card.label, x + 12, y + 19, {
        size: 8,
        bold: true,
        color: brand.muted,
      });
      addText(card.value, x + 12, y + 42, {
        size: index === 2 ? 13 : 12,
        bold: true,
        color: index === 2 ? brand.red : brand.ink,
        maxWidth: cardWidth - 24,
      });
    });

    y += cardHeight + 22;
  }

  function drawFilterLine() {
    const pieces = [
      `Date range: ${fromLabel} to ${toLabel}`,
      report?.filters?.dealerSearch
        ? `Dealer filter: ${report.filters.dealerSearch}`
        : "",
      report?.filters?.dealerId ? "Dealer scope: Single dealer" : "",
    ].filter(Boolean);

    addText(pieces.join("  |  ") || "Dealer scope: All dealers", marginX, y, {
      size: 9,
      color: brand.muted,
      maxWidth: contentWidth,
    });
    y += 22;
  }

  function drawTableHeader() {
    doc.setFillColor(...brand.softBg);
    doc.roundedRect(marginX, y - 14, contentWidth, 28, 7, 7, "F");

    addText("Date", marginX + 10, y + 4, {
      size: 8,
      bold: true,
      color: brand.muted,
    });
    addText("Order", marginX + 84, y + 4, {
      size: 8,
      bold: true,
      color: brand.muted,
    });
    addText("Status", marginX + 190, y + 4, {
      size: 8,
      bold: true,
      color: brand.muted,
    });
    addText("Routing", marginX + 278, y + 4, {
      size: 8,
      bold: true,
      color: brand.muted,
    });
    addText("Payment", marginX + 374, y + 4, {
      size: 8,
      bold: true,
      color: brand.muted,
    });
    addText("Dealer", marginX + 474, y + 4, {
      size: 8,
      bold: true,
      color: brand.muted,
    });
    addText("Amount", pageWidth - marginX - 10, y + 4, {
      size: 8,
      bold: true,
      color: brand.muted,
      align: "right",
    });

    y += 28;
  }

  function drawOrderRow(order) {
    ensureSpace(31);

    addText(formatDate(order.createdAt), marginX + 10, y, {
      size: 8.5,
      color: brand.ink,
    });
    addText(safe(order.orderNumber), marginX + 84, y, {
      size: 8.5,
      bold: true,
      color: brand.ink,
      maxWidth: 96,
    });
    addText(safe(order.status), marginX + 190, y, {
      size: 8.5,
      color: brand.ink,
      maxWidth: 78,
    });
    addText(safe(order.dealer?.fulfillmentMode || "FACTORY"), marginX + 278, y, {
      size: 8.5,
      color: brand.ink,
      maxWidth: 86,
    });
    addText(safe(order.payment?.method), marginX + 374, y, {
      size: 8.5,
      color: brand.ink,
      maxWidth: 90,
    });
    addText(safe(order.dealer?.companyName), marginX + 474, y, {
      size: 8.5,
      color: brand.ink,
      maxWidth: 184,
    });
    addText(money(order.totals?.total, order.totals?.currency || currency), pageWidth - marginX - 10, y, {
      size: 8.5,
      bold: true,
      color: brand.ink,
      align: "right",
    });

    y += 16;
    doc.setDrawColor(...brand.line);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 12;
  }

  function drawDealerGroup(group) {
    ensureSpace(76);

    doc.setFillColor(252, 244, 243);
    doc.setDrawColor(...brand.redSoft);
    doc.roundedRect(marginX, y, contentWidth, 44, 8, 8, "FD");
    addText(safe(group.dealer?.companyName), marginX + 12, y + 18, {
      size: 11,
      bold: true,
      color: brand.ink,
      maxWidth: 380,
    });
    addText(
      [
        group.dealer?.contactName,
        group.dealer?.phone,
        group.dealer?.email,
      ]
        .filter(Boolean)
        .join(" | "),
      marginX + 12,
      y + 34,
      {
        size: 8,
        color: brand.muted,
        maxWidth: 470,
      },
    );
    addText(`${group.orders.length} orders`, pageWidth - marginX - 190, y + 18, {
      size: 9,
      bold: true,
      color: brand.ink,
      align: "right",
    });
    addText(money(group.total, currency), pageWidth - marginX - 12, y + 18, {
      size: 11,
      bold: true,
      color: brand.red,
      align: "right",
    });

    y += 66;
    drawTableHeader();
    group.orders.forEach(drawOrderRow);
    y += 8;
  }

  header(true);
  drawSummary();
  drawFilterLine();

  if (!items.length) {
    doc.setFillColor(...brand.softBg);
    doc.setDrawColor(...brand.line);
    doc.roundedRect(marginX, y, contentWidth, 74, 10, 10, "FD");
    addText("No orders found for this report selection.", marginX + 16, y + 30, {
      size: 13,
      bold: true,
    });
    addText("Adjust the date range or dealer filter and generate again.", marginX + 16, y + 52, {
      size: 10,
      color: brand.muted,
    });
  } else {
    groups.forEach(drawDealerGroup);
  }

  footer();

  const scope = report?.filters?.dealerId
    ? "single-dealer"
    : report?.filters?.dealerSearch
      ? "filtered-dealers"
      : "all-dealers";
  const filename = `meitu-order-statements-${scope}-${cleanFilename(fromLabel)}-to-${cleanFilename(toLabel)}.pdf`;
  doc.save(filename);
}
