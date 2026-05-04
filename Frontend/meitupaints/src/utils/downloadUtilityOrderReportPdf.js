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

function formatDateScope(filters = {}) {
  if (filters.from && filters.to) {
    return `${formatDate(filters.from)} to ${formatDate(filters.to)}`;
  }
  return "All time";
}

function routeLabel(order = {}) {
  const mode = order?.dealer?.fulfillmentMode || "FACTORY";
  if (mode !== "DISPATCHER") return "Factory";
  const dispatcher =
    order?.dispatcher?.name || order?.dispatcher?.companyName || "";
  return dispatcher ? `Dispatcher - ${dispatcher}` : "Dispatcher";
}

function truncate(doc, value, maxWidth) {
  const text = safe(value);
  if (doc.getTextWidth(text) <= maxWidth) return text;

  let next = text;
  while (next.length > 3 && doc.getTextWidth(`${next}...`) > maxWidth) {
    next = next.slice(0, -1);
  }
  return `${next}...`;
}

export async function downloadUtilityOrderReportPdf({
  report,
  title = "Order Utility Report",
  scopeLabel = "Operations",
  filenameScope = "orders",
} = {}) {
  if (!report) return;

  const items = Array.isArray(report.items) ? report.items : [];
  const filters = report.filters || {};
  const totals = report.totals || {};
  const currency = totals.currency || "NPR";
  const dateScope = formatDateScope(filters);

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 36;
  const contentWidth = pageWidth - marginX * 2;
  const footerY = pageHeight - 18;
  const usableBottom = pageHeight - 42;

  const brand = {
    red: [180, 35, 24],
    redDark: [127, 29, 29],
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
    doc.text(safe(text), x, yy, {
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
      doc.rect(0, 0, pageWidth, 78, "F");
      doc.setFillColor(...brand.red);
      doc.rect(0, 78, pageWidth, 4, "F");

      addText("Meitu Construction Materials Pvt. Ltd.", marginX, 31, {
        size: 17,
        bold: true,
        color: brand.white,
      });
      addText(title, marginX, 56, {
        size: 11,
        bold: true,
        color: [255, 236, 236],
      });
      addText(dateScope, pageWidth - marginX, 32, {
        size: 10,
        bold: true,
        color: brand.white,
        align: "right",
      });
      addText(scopeLabel, pageWidth - marginX, 56, {
        size: 9,
        color: [255, 236, 236],
        align: "right",
      });
      y = 108;
      return;
    }

    doc.setFillColor(...brand.softBg);
    doc.rect(0, 0, pageWidth, 44, "F");
    addText(title, marginX, 27, { size: 11, bold: true });
    addText(dateScope, pageWidth - marginX, 27, {
      size: 9,
      color: brand.muted,
      align: "right",
    });
    y = 64;
  }

  function newPage() {
    footer();
    doc.addPage();
    page += 1;
    header(false);
  }

  function ensureSpace(height = 36) {
    if (y + height > usableBottom) {
      newPage();
    }
  }

  function drawSummary() {
    const cards = [
      {
        label: "Orders",
        value: Number(totals.orderCount || items.length || 0).toLocaleString(),
      },
      {
        label: "Dealers",
        value: Number(totals.dealerCount || 0).toLocaleString(),
      },
      {
        label: "Total Value",
        value: money(totals.total, currency),
        accent: true,
      },
      {
        label: "Average Order",
        value: money(
          Number(totals.orderCount || items.length)
            ? Number(totals.total || 0) /
                Number(totals.orderCount || items.length || 1)
            : 0,
          currency,
        ),
      },
    ];

    const gap = 10;
    const cardWidth = (contentWidth - gap * (cards.length - 1)) / cards.length;
    const cardHeight = 54;

    cards.forEach((card, index) => {
      const x = marginX + index * (cardWidth + gap);
      doc.setFillColor(...brand.softBg);
      doc.setDrawColor(...brand.line);
      doc.roundedRect(x, y, cardWidth, cardHeight, 7, 7, "FD");
      addText(card.label, x + 12, y + 18, {
        size: 8,
        bold: true,
        color: brand.muted,
      });
      addText(card.value, x + 12, y + 39, {
        size: card.accent ? 13 : 12,
        bold: true,
        color: card.accent ? brand.red : brand.ink,
        maxWidth: cardWidth - 24,
      });
    });

    y += cardHeight + 20;
  }

  function drawFilterSummary() {
    const pieces = [
      `Date: ${dateScope}`,
      filters.status ? `Status: ${filters.status}` : "Status: All",
      filters.fulfillmentMode
        ? `Routing: ${filters.fulfillmentMode}`
        : "Routing: All",
      filters.dispatcherName
        ? `Dispatcher: ${filters.dispatcherName}`
        : filters.dispatcherId
          ? "Dispatcher: Selected"
          : "",
      filters.dealerName
        ? `Dealer: ${filters.dealerName}`
        : filters.dealerSearch
          ? `Dealer filter: ${filters.dealerSearch}`
          : "",
      filters.minTotal ? `Min amount: ${money(filters.minTotal, currency)}` : "",
      filters.maxTotal ? `Max amount: ${money(filters.maxTotal, currency)}` : "",
    ].filter(Boolean);

    addText(pieces.join("  |  "), marginX, y, {
      size: 9,
      color: brand.muted,
      maxWidth: contentWidth,
    });
    y += 24;
  }

  function drawTableHeader() {
    doc.setFillColor(...brand.softBg);
    doc.roundedRect(marginX, y - 14, contentWidth, 28, 7, 7, "F");
    addText("Date", marginX + 10, y + 4, {
      size: 8,
      bold: true,
      color: brand.muted,
    });
    addText("Order", marginX + 82, y + 4, {
      size: 8,
      bold: true,
      color: brand.muted,
    });
    addText("Dealer", marginX + 184, y + 4, {
      size: 8,
      bold: true,
      color: brand.muted,
    });
    addText("Routing", marginX + 384, y + 4, {
      size: 8,
      bold: true,
      color: brand.muted,
    });
    addText("Status", marginX + 526, y + 4, {
      size: 8,
      bold: true,
      color: brand.muted,
    });
    addText("Payment", marginX + 612, y + 4, {
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
    });
    addText(truncate(doc, order.orderNumber, 88), marginX + 82, y, {
      size: 8.5,
      bold: true,
    });
    addText(truncate(doc, order?.dealer?.companyName, 180), marginX + 184, y, {
      size: 8.5,
    });
    addText(truncate(doc, routeLabel(order), 126), marginX + 384, y, {
      size: 8.5,
    });
    addText(truncate(doc, order.status, 72), marginX + 526, y, {
      size: 8.5,
    });
    addText(truncate(doc, order?.payment?.method, 92), marginX + 612, y, {
      size: 8.5,
    });
    addText(money(order?.totals?.total, order?.totals?.currency || currency), pageWidth - marginX - 10, y, {
      size: 8.5,
      bold: true,
      align: "right",
    });

    y += 16;
    doc.setDrawColor(...brand.line);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 12;
  }

  header(true);
  drawSummary();
  drawFilterSummary();

  if (!items.length) {
    doc.setFillColor(...brand.softBg);
    doc.setDrawColor(...brand.line);
    doc.roundedRect(marginX, y, contentWidth, 72, 9, 9, "FD");
    addText("No orders match this report selection.", marginX + 16, y + 29, {
      size: 12,
      bold: true,
    });
    addText("Adjust the filters and preview the report again.", marginX + 16, y + 51, {
      size: 9,
      color: brand.muted,
    });
  } else {
    drawTableHeader();
    items.forEach(drawOrderRow);
  }

  footer();

  const filename = `meitu-${cleanFilename(filenameScope)}-${cleanFilename(dateScope)}.pdf`;
  doc.save(filename);
}
