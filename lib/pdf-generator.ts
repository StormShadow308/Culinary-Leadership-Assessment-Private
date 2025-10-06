import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFGenerationOptions {
  filename?: string;
  title?: string;
  includeCharts?: boolean;
}

export async function generateDashboardPDF(
  elementId: string,
  options: PDFGenerationOptions = {}
): Promise<void> {
  const {
    filename = 'culinary-assessment-report.pdf',
    title = 'Culinary Assessment Analysis Report',
    includeCharts = true
  } = options;

  try {
    // Get the element to capture
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found for PDF generation');
    }

    // Show loading state
    const loadingElement = document.getElementById('pdf-loading');
    if (loadingElement) {
      loadingElement.style.display = 'block';
    }

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Calculate dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;

    // Add title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, pdfWidth / 2, 20, { align: 'center' });

    // Add date
    const currentDate = new Date().toLocaleDateString();
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on: ${currentDate}`, pdfWidth / 2, 25, { align: 'center' });

    // Add the image
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

    // Add page numbers if content spans multiple pages
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.text(`Page ${i} of ${pageCount}`, pdfWidth - 20, pdfHeight - 10);
    }

    // Save the PDF
    pdf.save(filename);

    // Hide loading state
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
}

export function downloadChartsAsImages(): void {
  // This function can be used to download individual charts as images
  const charts = document.querySelectorAll('[data-chart]');
  
  charts.forEach((chart, index) => {
    html2canvas(chart as HTMLElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `chart-${index + 1}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  });
}
