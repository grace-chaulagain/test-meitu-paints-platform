import jsPDF from "jspdf";

function money(value, currency = "NPR") {
  return `${currency} ${Number(value || 0).toLocaleString()}`;
}

function safe(value) {
  return value === null || value === undefined || value === ""
    ? "—"
    : String(value);
}

function formatDateTime(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "—";
  }
}

function resolveDealer(order, dealer) {
  return dealer || order?.dealerSnapshot || order?.dealerId || {};
}

function resolveItems(order) {
  if (Array.isArray(order?.items)) return order.items;
  if (Array.isArray(order?.snapshot?.items)) return order.snapshot.items;
  return [];
}

export async function downloadOrderSummaryPdf({ order, dealer }) {
  if (!order) return;

  const resolvedDealer = resolveDealer(order, dealer);
  const resolvedItems = resolveItems(order);
  const currency = order?.totals?.currency || "NPR";
  const filename = `${safe(order?.orderNumber || "order-summary").replace(/\s+/g, "-")}.pdf`;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginX = 42;
  const contentWidth = pageWidth - marginX * 2;
  const usableBottom = pageHeight - 74;
  const footerY = pageHeight - 18;

  const brand = {
    red: [181, 28, 28],
    redDark: [137, 17, 17],
    redSoft: [229, 62, 62],
    ink: [15, 23, 42],
    muted: [100, 116, 139],
    line: [226, 232, 240],
    softBg: [248, 250, 252],
    softCard: [252, 252, 253],
    white: [255, 255, 255],
  };

  let y = 0;
  let currentPage = 1;

  function setFont({ size = 11, bold = false, color = brand.ink } = {}) {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
  }

  function addText(text, x, yy, opts = {}) {
    setFont(opts);
    doc.text(text, x, yy, {
      align: opts.align || "left",
      maxWidth: opts.maxWidth,
    });
  }

  function addWrappedText(text, x, yy, maxWidth, opts = {}) {
    setFont(opts);
    const lines = doc.splitTextToSize(String(text), maxWidth);
    doc.text(lines, x, yy, {
      align: opts.align || "left",
      maxWidth,
    });
    return lines;
  }

  function drawFooter(pageNo) {
    doc.setDrawColor(...brand.line);
    doc.line(marginX, pageHeight - 34, pageWidth - marginX, pageHeight - 34);

    addText(`Generated on ${new Date().toLocaleString()}`, marginX, footerY, {
      size: 9,
      color: brand.muted,
    });

    addText(`Page ${pageNo}`, pageWidth - marginX, footerY, {
      size: 9,
      color: brand.muted,
      align: "right",
    });
  }

  function drawHeader(firstPage = false) {
    if (firstPage) {
      doc.setFillColor(...brand.redDark);
      doc.rect(0, 0, pageWidth, 104, "F");

      doc.setFillColor(...brand.redSoft);
      doc.rect(0, 104, pageWidth, 6, "F");

      const leftX = marginX;
      const rightX = pageWidth - marginX;
      const rightColWidth = 220;
      const leftColWidth = contentWidth - rightColWidth - 18;

      addText("Meitu Construction Materials Pvt. Ltd.", leftX, 38, {
        size: 19,
        bold: true,
        color: brand.white,
        maxWidth: leftColWidth,
      });

      addText("Order Summary", leftX, 84, {
        size: 12,
        bold: true,
        color: [255, 236, 236],
      });

      addText(safe(order?.orderNumber || "—"), rightX, 38, {
        size: 12,
        bold: true,
        color: brand.white,
        align: "right",
        maxWidth: rightColWidth,
      });

      addText(`Status: ${safe(order?.status)}`, rightX, 62, {
        size: 10,
        color: [255, 236, 236],
        align: "right",
        maxWidth: rightColWidth,
      });

      addText(`Submitted: ${formatDateTime(order?.createdAt)}`, rightX, 84, {
        size: 9,
        color: [255, 236, 236],
        align: "right",
        maxWidth: rightColWidth,
      });

      y = 134;
    } else {
      doc.setFillColor(...brand.softBg);
      doc.rect(0, 0, pageWidth, 56, "F");

      addText("Meitu Construction Materials Pvt. Ltd.", marginX, 24, {
        size: 12,
        bold: true,
        color: brand.ink,
        maxWidth: 320,
      });

      addText("Madhyapur Thimi-08, Bhaktapur", marginX, 40, {
        size: 9,
        color: brand.muted,
        maxWidth: 320,
      });

      addText(safe(order?.orderNumber || "—"), pageWidth - marginX, 26, {
        size: 10,
        bold: true,
        color: brand.ink,
        align: "right",
        maxWidth: 220,
      });

      addText(`Status: ${safe(order?.status)}`, pageWidth - marginX, 42, {
        size: 9,
        color: brand.muted,
        align: "right",
        maxWidth: 220,
      });

      y = 74;
    }
  }

  function newPage() {
    drawFooter(currentPage);
    doc.addPage();
    currentPage += 1;
    drawHeader(false);
  }

  function ensureSpace(heightNeeded = 40) {
    if (y + heightNeeded > usableBottom) {
      newPage();
    }
  }

  function drawSectionTitle(title) {
    ensureSpace(34);

    addText(title, marginX, y, {
      size: 13,
      bold: true,
      color: brand.ink,
    });

    y += 12;

    doc.setDrawColor(...brand.line);
    doc.line(marginX, y, pageWidth - marginX, y);

    y += 18;
  }

  function drawInfoGrid(rows = []) {
    const leftX = marginX;
    const rightX = pageWidth / 2 + 12;
    const colWidth = pageWidth / 2 - marginX - 24;

    for (let i = 0; i < rows.length; i += 2) {
      const left = rows[i];
      const right = rows[i + 1];

      ensureSpace(54);

      if (left) {
        addText(left.label, leftX, y, {
          size: 9,
          bold: true,
          color: brand.muted,
        });
      }

      if (right) {
        addText(right.label, rightX, y, {
          size: 9,
          bold: true,
          color: brand.muted,
        });
      }

      y += 14;

      let leftLines = ["—"];
      let rightLines = ["—"];

      if (left) {
        leftLines = addWrappedText(safe(left.value), leftX, y, colWidth, {
          size: 11,
          bold: !!left.bold,
          color: brand.ink,
        });
      }

      if (right) {
        rightLines = addWrappedText(safe(right.value), rightX, y, colWidth, {
          size: 11,
          bold: !!right.bold,
          color: brand.ink,
        });
      }

      y += Math.max(leftLines.length, rightLines.length) * 14 + 14;
    }
  }

  function drawBlock(label, value) {
    ensureSpace(56);

    addText(label, marginX, y, {
      size: 9,
      bold: true,
      color: brand.muted,
    });

    y += 14;

    const lines = addWrappedText(safe(value), marginX, y, contentWidth, {
      size: 11,
      color: brand.ink,
    });

    y += lines.length * 14 + 12;
  }

  function drawSummaryStrip() {
    ensureSpace(78);

    const stripY = y;
    const gap = 10;
    const boxWidth = (contentWidth - gap * 2) / 3;
    const boxHeight = 58;

    const items = [
      {
        label: "Dealer",
        value: safe(resolvedDealer?.companyName),
      },
      {
        label: "Payment",
        value: safe(order?.payment?.method),
      },
      {
        label: "Total",
        value: money(order?.totals?.total, currency),
      },
    ];

    items.forEach((item, index) => {
      const boxX = marginX + index * (boxWidth + gap);

      doc.setFillColor(...brand.softCard);
      doc.setDrawColor(...brand.line);
      doc.roundedRect(boxX, stripY, boxWidth, boxHeight, 10, 10, "FD");

      addText(item.label, boxX + 12, stripY + 18, {
        size: 8,
        bold: true,
        color: brand.muted,
      });

      addText(item.value, boxX + 12, stripY + 40, {
        size: 11,
        bold: true,
        color: index === 2 ? brand.red : brand.ink,
        maxWidth: boxWidth - 24,
      });
    });

    y += boxHeight + 20;
  }

  function drawItemsTable() {
    drawSectionTitle("Order Items");

    const col = {
      snX: marginX,
      itemX: 74,
      packX: 374,
      qtyX: 448,
      rateX: 514,
      amountX: 584,
      itemWidth: 270,
    };

    function tableHeader() {
      ensureSpace(34);

      doc.setFillColor(...brand.softBg);
      doc.roundedRect(marginX, y - 12, contentWidth, 28, 8, 8, "F");

      addText("SN", col.snX, y + 6, {
        size: 9,
        bold: true,
        color: [71, 85, 105],
      });

      addText("Item", col.itemX, y + 6, {
        size: 9,
        bold: true,
        color: [71, 85, 105],
      });

      addText("Pack", col.packX, y + 6, {
        size: 9,
        bold: true,
        color: [71, 85, 105],
      });

      addText("Qty", col.qtyX, y + 6, {
        size: 9,
        bold: true,
        color: [71, 85, 105],
        align: "right",
      });

      addText("Rate", col.rateX, y + 6, {
        size: 9,
        bold: true,
        color: [71, 85, 105],
        align: "right",
      });

      addText("Amount", col.amountX, y + 6, {
        size: 9,
        bold: true,
        color: [71, 85, 105],
        align: "right",
      });

      y += 34;
    }

    tableHeader();

    resolvedItems.forEach((item, index) => {
      const itemName = safe(item?.name);
      const itemCode = safe(item?.sku || item?.code || "");

      setFont({ size: 10, bold: true, color: brand.ink });
      const nameLines = doc.splitTextToSize(itemName, col.itemWidth);

      setFont({ size: 9, bold: false, color: brand.muted });
      const codeLines =
        itemCode && itemCode !== "—"
          ? doc.splitTextToSize(itemCode, col.itemWidth)
          : [];

      const nameHeight = nameLines.length * 13;
      const codeGap = codeLines.length ? 5 : 0;
      const codeHeight = codeLines.length * 10;
      const contentHeight = nameHeight + codeGap + codeHeight;
      const rowHeight = Math.max(28, contentHeight);

      ensureSpace(rowHeight + 22);

      if (y + rowHeight > usableBottom) {
        newPage();
        drawSectionTitle("Order Items (continued)");
        tableHeader();
      }

      const rowTop = y;
      const codeY = rowTop + nameHeight + codeGap;

      addText(String(index + 1), col.snX, rowTop, {
        size: 10,
        bold: true,
        color: brand.muted,
      });

      addText(nameLines, col.itemX, rowTop, {
        size: 10,
        bold: true,
        color: brand.ink,
        maxWidth: col.itemWidth,
      });

      if (codeLines.length) {
        addText(codeLines, col.itemX, codeY, {
          size: 9,
          color: brand.muted,
          maxWidth: col.itemWidth,
        });
      }

      addText(
        safe(item?.packLabel || item?.variantLabel || item?.unit),
        col.packX,
        rowTop,
        {
          size: 10,
          color: brand.ink,
        },
      );

      addText(Number(item?.quantity || 0).toLocaleString(), col.qtyX, rowTop, {
        size: 10,
        color: brand.ink,
        align: "right",
      });

      addText(
        Number(item?.unitPrice || 0).toLocaleString(),
        col.rateX,
        rowTop,
        {
          size: 10,
          color: brand.ink,
          align: "right",
        },
      );

      addText(
        Number(item?.lineTotal || 0).toLocaleString(),
        col.amountX,
        rowTop,
        {
          size: 10,
          bold: true,
          color: brand.ink,
          align: "right",
        },
      );

      y += rowHeight + 12;

      if (index !== resolvedItems.length - 1) {
        doc.setDrawColor(...brand.line);
        doc.line(marginX, y - 4, pageWidth - marginX, y - 4);
        y += 8;
      }
    });
  }

  function drawTotalsBox() {
    ensureSpace(124);

    const boxWidth = 238;
    const boxX = pageWidth - marginX - boxWidth;

    doc.setFillColor(252, 244, 243);
    doc.setDrawColor(...brand.redSoft);
    doc.roundedRect(boxX, y, boxWidth, 102, 12, 12, "FD");

    addText("Order Total", boxX + 16, y + 24, {
      size: 10,
      bold: true,
      color: brand.muted,
    });

    addText(
      money(order?.totals?.total, currency),
      boxX + boxWidth - 16,
      y + 50,
      {
        size: 18,
        bold: true,
        color: brand.red,
        align: "right",
      },
    );

    addText(`Status: ${safe(order?.status)}`, boxX + 16, y + 74, {
      size: 10,
      color: brand.ink,
    });

    addText(`Items: ${resolvedItems.length}`, boxX + boxWidth - 16, y + 74, {
      size: 10,
      color: brand.ink,
      align: "right",
    });

    y += 122;
  }

  drawHeader(true);
  drawSummaryStrip();

  drawSectionTitle("Order Overview");
  drawInfoGrid([
    { label: "Order Number", value: order?.orderNumber, bold: true },
    { label: "Status", value: order?.status, bold: true },
    { label: "Dealer", value: resolvedDealer?.companyName },
    { label: "Submitted", value: formatDateTime(order?.createdAt) },
  ]);

  drawSectionTitle("Dealer Information");
  drawInfoGrid([
    { label: "Contact", value: resolvedDealer?.contactName },
    { label: "Phone", value: resolvedDealer?.phone },
    { label: "Email", value: resolvedDealer?.email },
    { label: "Address", value: resolvedDealer?.address },
  ]);

  drawSectionTitle("Payment Information");
  drawInfoGrid([
    { label: "Method", value: order?.payment?.method },
    { label: "Reference", value: order?.payment?.reference },
  ]);

  drawItemsTable();
  drawTotalsBox();

  if (order?.dealerNote) {
    drawSectionTitle("Dealer Note");
    drawBlock("Note", order.dealerNote);
  }

  if (order?.internalNote) {
    drawSectionTitle("Internal Note");
    drawBlock("Note", order.internalNote);
  }

  drawFooter(currentPage);
  doc.save(filename);
}
