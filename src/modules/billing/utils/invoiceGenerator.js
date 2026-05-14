import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import bubblebathLogo from '../../../assets/bubblebath-icon.png';

export const generateInvoice = (billing, garments) => {
    const doc = new jsPDF();

    // Configuration
    const primaryColor = [52, 152, 219]; // Blue theme
    const darkGray = [80, 80, 80];
    const lightGray = [150, 150, 150];

    // --- Header Section ---
    // Logo
    doc.addImage(bubblebathLogo, "PNG", 14, 15, 20, 18);

    // Business Info
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("BUBBLE BATH", 38, 24);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text("Laundry & Dry Cleaning", 38, 30);

    doc.setFontSize(9);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text("358 Biñang 2nd F.Halili Ave, Bocaue Bulacan", 14, 45);
    doc.text("Mobile No: 09751598851", 14, 50);
    doc.text("Email: cherryc.inducil@gmail.com", 14, 55);

    // --- Invoice Info (Right side) ---
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text("INVOICE", 150, 24);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

    const invoiceDetails = [
        ['Invoice Number:', `INV-${String(billing.billing_id).padStart(5, '0')}`],
        ['Order Reference:', `#${billing.order_id}`],
        ['Date:', billing.created_at.split(' ')[0]],
        ['Status:', billing.status.replace('_', ' ').toUpperCase()],
        ['Payment Method:', billing.payment_methods ? billing.payment_methods.toUpperCase() : 'N/A']
    ];

    let startY = 35;
    invoiceDetails.forEach(detail => {
        doc.setFont("helvetica", "bold");
        doc.text(detail[0], 140, startY);
        doc.setFont("helvetica", "normal");
        doc.text(detail[1], 175, startY);
        startY += 6;
    });

    // --- Divider ---
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 62, 196, 62);

    // --- Customer Info ---
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Billed To:", 14, 72);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text(billing.customer_name || "N/A", 14, 78);
    doc.text(billing.customer_contact || "No Contact Available", 14, 83);
    doc.text(billing.customer_address || "No Address Available", 14, 88);

    // --- Itemized Table ---
    const tableData = garments.map(g => [
        `${g.service}`,
        `${g.type}`,
        g.quantity,
        `P ${parseFloat(g.unit_price).toFixed(2)}`,
        `P ${(g.quantity * parseFloat(g.unit_price)).toFixed(2)}`
    ]);

    autoTable(doc, {
        startY: 98,
        head: [['Service', 'Garment Type', 'Quantity', 'Unit Price', 'Subtotal']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 9,
            cellPadding: 5
        },
        columnStyles: {
            0: { cellWidth: 45, halign: 'left' },
            1: { cellWidth: 45, halign: 'left' },
            2: { cellWidth: 30, halign: 'center' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 30, halign: 'right' }
        }
    });

    // --- Financial Summary ---
    const finalY = doc.lastAutoTable.finalY + 10;

    // Summary values
    const summaryData = [
        ['Subtotal:', `P ${parseFloat(billing.subtotal).toFixed(2)}`],
        ['Grand Total:', `P ${parseFloat(billing.total_amount).toFixed(2)}`],
        ['Amount Paid:', `P ${parseFloat(billing.total_paid || 0).toFixed(2)}`],
        ['Remaining Balance:', `P ${parseFloat(billing.remaining_balance).toFixed(2)}`]
    ];

    let summaryY = finalY;
    summaryData.forEach((row, index) => {
        // Grand total row styling
        if (index === 3) {
            summaryY += 2;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        } else {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        }

        // Balance styling
        if (index === 5 && parseFloat(billing.remaining_balance) > 0) {
            doc.setTextColor(220, 53, 69); // Bootstrap danger red
            doc.setFont("helvetica", "bold");
        }

        doc.text(row[0], 140, summaryY);
        doc.text(row[1], 190, summaryY, { align: 'right' });
        summaryY += 6;
    });

    // --- Footer ---
    const pageHeight = doc.internal.pageSize.height;

    doc.setDrawColor(220, 220, 220);
    doc.line(14, pageHeight - 30, 196, pageHeight - 30);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text("Thank you for your business!", 105, pageHeight - 22, { align: "center" });

    doc.setFontSize(8);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, pageHeight - 16, { align: "center" });

    // --- Save PDF ---
    doc.save(`Invoice_INV-${String(billing.billing_id).padStart(5, '0')}.pdf`);
};
