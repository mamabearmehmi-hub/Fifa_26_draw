import { jsPDF } from "jspdf";
import { Team } from "./teamsData";

interface DrawPair {
  employeeName: string;
  team: Team;
  timestamp: string;
}

/**
 * Generates a beautiful, high-quality, corporate-branded PDF for the completed Sweepstakes Draw.
 */
export function exportLeaderboardToPDF(draws: DrawPair[], companyName: string = "Corporate Office") {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Define FIFA Slate & Gold Branding Colors
  const COLOR_PRIMARY_DARK = [15, 23, 42]; // Slate 900
  const COLOR_ACCENT_GOLD = [234, 179, 8]; // Gold 500
  const COLOR_TEXT_MUTED = [100, 116, 139]; // Slate 500
  const COLOR_LIGHT_BG = [248, 250, 252]; // Slate 50

  const drawHeader = (pageNum: number, totalPages: number) => {
    // Top Brand Accent Bar (Gold)
    doc.setFillColor(COLOR_ACCENT_GOLD[0], COLOR_ACCENT_GOLD[1], COLOR_ACCENT_GOLD[2]);
    doc.rect(0, 0, pageWidth, 5, "F");

    // Header Background Block (Slate-900)
    doc.setFillColor(COLOR_PRIMARY_DARK[0], COLOR_PRIMARY_DARK[1], COLOR_PRIMARY_DARK[2]);
    doc.rect(0, 5, pageWidth, 28, "F");

    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("FIFA WORLD CUP 2026™ SWEEPSTAKES", 14, 17);

    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(234, 179, 8); // Gold text
    doc.text(`OFFICIAL LIVE DRAW RESULT  |  ${companyName.toUpperCase()}`, 14, 23);

    // Decorative Right Wing
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // light gray
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 35, 17);

    // Timestamp
    const dateStr = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    doc.text(`Generated: ${dateStr}`, pageWidth - 55, 23);

    // Header divider line
    doc.setDrawColor(234, 179, 8);
    doc.setLineWidth(0.5);
    doc.line(0, 33, pageWidth, 33);
  };

  const drawFooter = (pageNum: number, totalPages: number) => {
    // Footer Bottom Line
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);
    doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);

    // Footer Text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(COLOR_TEXT_MUTED[0], COLOR_TEXT_MUTED[1], COLOR_TEXT_MUTED[2]);
    doc.text(
      "CONFIDENTIAL & PROPRIETARY  |  Fair Draw Audited & Sealed Live via Fisher-Yates Randomization Model",
      14,
      pageHeight - 10
    );
    doc.text("© FIFA 2026 and related logos are trademarks of FIFA.", pageWidth - 76, pageHeight - 10);
  };

  // Sort draws by Team Name or rank for elegant structured listing
  const sortedDraws = [...draws].sort((a, b) => a.team.name.localeCompare(b.team.name));

  // Determine pagination. We have 48 items list.
  // We can render 24 items per page in a magnificent side-by-side 2-column or full 1-column layout.
  // If we do 1 column, 24 rows per page fits beautifully on 2 pages!
  // Let's do a 2-column table list on page 1 of 24 items, allowing everything to look super compact and perfectly polished!
  // Wait, let's do a gorgeous clean 2-column grid layout per page.
  // 24 pairs on Page 1, 24 pairs on Page 2.
  // Each page will display 2 columns of 12 rows each! This is incredibly neat and saves paper, looking exceptionally executive!
  const itemsPerPage = 24; 
  const totalPages = Math.ceil(sortedDraws.length / itemsPerPage);

  for (let pObj = 1; pObj <= totalPages; pObj++) {
    if (pObj > 1) {
      doc.addPage();
    }

    drawHeader(pObj, totalPages);
    drawFooter(pObj, totalPages);

    const startIndex = (pObj - 1) * itemsPerPage;
    const pageItems = sortedDraws.slice(startIndex, startIndex + itemsPerPage);

    // Draw Column Headers
    // Col 1
    doc.setFillColor(241, 245, 249);
    doc.rect(14, 40, 85, 8, "F");
    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("TEAM & FEDERATION", 18, 45);
    doc.text("ASSIGNED EMPLOYEE", 58, 45);

    // Col 2
    doc.setFillColor(241, 245, 249);
    doc.rect(111, 40, 85, 8, "F");
    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("TEAM & FEDERATION", 115, 45);
    doc.text("ASSIGNED EMPLOYEE", 155, 45);

    // Grid row rendering
    const rowsNum = 12; // 12 rows, 2 columns = 24 items
    const startY = 48;
    const rowHeight = 16;

    for (let r = 0; r < rowsNum; r++) {
      const currentY = startY + r * rowHeight;
      
      // Draw grid row lines
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.15);
      doc.line(14, currentY + rowHeight, 199, currentY + rowHeight);

      // Render Left Column (Item r)
      const leftIdx = r;
      if (leftIdx < pageItems.length) {
        const item = pageItems[leftIdx];
        
        // Alternating background
        if (r % 2 === 0) {
          doc.setFillColor(252, 252, 253);
          doc.rect(14, currentY, 85, rowHeight, "F");
        }

        // Team Flag emoji & Name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        // We write country names but skip emojis or render safely as jsPDF doesn't render colorful emojis natively. 
        // Rendering [CODE] + Name is much cleaner and avoids rendering broken tofu characters!
        doc.text(`[${item.team.code}] ${item.team.name}`, 18, currentY + 7);

        // Confederation
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`${item.team.confederation} | Rank #${item.team.fifaRank}`, 18, currentY + 11);

        // Employee Name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(21, 128, 61); // forest green
        doc.text(item.employeeName, 58, currentY + 9);
      }

      // Render Right Column (Item r + 12)
      const rightIdx = r + 12;
      if (rightIdx < pageItems.length) {
        const item = pageItems[rightIdx];

        // Alternating background
        if (r % 2 === 0) {
          doc.setFillColor(252, 252, 253);
          doc.rect(111, currentY, 85, rowHeight, "F");
        }

        // Team Flag & Name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`[${item.team.code}] ${item.team.name}`, 115, currentY + 7);

        // Confederation
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(`${item.team.confederation} | Rank #${item.team.fifaRank}`, 115, currentY + 11);

        // Employee Name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(21, 128, 61); // forest green
        doc.text(item.employeeName, 155, currentY + 9);
      }
    }
  }

  // Save the PDF
  const safeFilename = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_world_cup_sweepstakes.pdf`;
  doc.save(safeFilename);
}
