import jsPDF from 'jspdf';

interface Activity {
  time: string;
  activity: string;
}

interface DayPlan {
  day: number;
  location: string;
  activities: Activity[];
  recommendation?: string;
}

interface ItineraryData {
  title?: string;
  startCity?: string;
  duration?: string;
  dates?: string;
  groupType?: string;
  interests?: string[];
  budget?: string;
  structuredDays?: DayPlan[];
  rawContent?: string;
}

export const generateItineraryPDF = (itinerary: ItineraryData, formData?: any) => {
  const doc = new jsPDF();
  
  // Page settings
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkAndAddPage = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to wrap text
  const wrapText = (text: string, maxWidth: number): string[] => {
    return doc.splitTextToSize(text, maxWidth);
  };

  // ==================== HEADER ====================
  // Add header background
  doc.setFillColor(16, 185, 129); // Green color
  doc.rect(0, 0, pageWidth, 50, 'F');

  // Add logo/title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('JHARKHAND TOURISM', pageWidth / 2, 22, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Personalized Travel Itinerary', pageWidth / 2, 35, { align: 'center' });

  yPosition = 60;

  // ==================== ITINERARY TITLE ====================
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  const title = itinerary.title || formData?.title || 'Your Jharkhand Adventure';
  doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Decorative line
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(1);
  doc.line(margin + 40, yPosition, pageWidth - margin - 40, yPosition);
  yPosition += 15;

  // ==================== TRIP OVERVIEW ====================
  doc.setFillColor(249, 250, 251); // Light gray background
  doc.roundedRect(margin, yPosition, contentWidth, 50, 3, 3, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text('TRIP OVERVIEW', margin + 5, yPosition + 10);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const startCity = itinerary.startCity || formData?.startCity || 'Ranchi';
  const duration = itinerary.duration || formData?.duration || 'N/A';
  const dates = itinerary.dates || formData?.dates || 'To be decided';
  const groupType = itinerary.groupType || formData?.groupType || 'Solo';
  const budget = itinerary.budget || 'Contact for details';

  doc.text(`Starting Point: ${startCity}`, margin + 10, yPosition + 22);
  doc.text(`Duration: ${duration} days`, margin + 10, yPosition + 30);
  doc.text(`Travel Dates: ${dates}`, margin + 10, yPosition + 38);
  
  doc.text(`Group Type: ${groupType}`, pageWidth / 2 + 10, yPosition + 22);
  doc.text(`Estimated Budget: ${budget}`, pageWidth / 2 + 10, yPosition + 30);

  // Interests
  if (itinerary.interests && itinerary.interests.length > 0) {
    doc.text(`Interests: ${itinerary.interests.join(', ')}`, pageWidth / 2 + 10, yPosition + 38);
  } else if (formData?.interests && formData.interests.length > 0) {
    doc.text(`Interests: ${formData.interests.join(', ')}`, pageWidth / 2 + 10, yPosition + 38);
  }

  yPosition += 65;

  // ==================== DAY-BY-DAY ITINERARY ====================
  if (itinerary.structuredDays && itinerary.structuredDays.length > 0) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('Day-by-Day Itinerary', margin, yPosition);
    yPosition += 12;

    itinerary.structuredDays.forEach((day) => {
      checkAndAddPage(60);

      // Day header box
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(margin, yPosition, contentWidth, 12, 2, 2, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(`DAY ${day.day}: ${day.location.toUpperCase()}`, margin + 5, yPosition + 8);
      
      yPosition += 18;

      // Activities
      if (day.activities && day.activities.length > 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        day.activities.forEach((activity) => {
          checkAndAddPage(15);

          // Time badge
          doc.setFillColor(243, 244, 246);
          doc.roundedRect(margin + 5, yPosition - 3, 22, 6, 1, 1, 'F');
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(75, 85, 99);
          doc.text(activity.time, margin + 7, yPosition + 2);

          // Activity description
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(31, 41, 55);
          const activityLines = wrapText(activity.activity, contentWidth - 35);
          activityLines.forEach((line, lineIndex) => {
            if (lineIndex > 0) checkAndAddPage(6);
            doc.text(`• ${line}`, margin + 30, yPosition + (lineIndex * 6));
          });

          yPosition += Math.max(8, activityLines.length * 6);
        });
      }

      yPosition += 5;

      // Recommendation box
      if (day.recommendation) {
        checkAndAddPage(25);
        
        const recLines = wrapText(day.recommendation, contentWidth - 15);
        const boxHeight = 12 + (recLines.length * 5) + 5;
        
        doc.setFillColor(254, 252, 232); // Light yellow
        doc.roundedRect(margin, yPosition, contentWidth, boxHeight, 2, 2, 'F');
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(180, 83, 9); // Orange-brown
        doc.text('Local Tip:', margin + 5, yPosition + 6);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 53, 15);
        recLines.forEach((line, index) => {
          doc.text(line, margin + 5, yPosition + 12 + (index * 5));
        });

        yPosition += boxHeight;
      }

      yPosition += 10;
    });
  } 
  // If no structured days, show raw content
  else if (itinerary.rawContent) {
    checkAndAddPage(30);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('Your Itinerary', margin, yPosition);
    yPosition += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);

    // Parse and format the raw content
    const contentLines = itinerary.rawContent.split('\n');
    contentLines.forEach(line => {
      if (line.trim()) {
        checkAndAddPage(10);
        const wrappedLines = wrapText(line, contentWidth);
        wrappedLines.forEach((wrappedLine, index) => {
          if (index > 0) checkAndAddPage(6);
          doc.text(wrappedLine, margin, yPosition);
          yPosition += 6;
        });
        yPosition += 2; // Extra space between paragraphs
      }
    });
  }

  // ==================== FOOTER ====================
  const addFooter = (pageNum: number) => {
    doc.setFillColor(243, 244, 246);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(
      'Generated by Jharkhand Smart Tourism Platform | Visit: jharkhandtourism.gov.in',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    
    doc.setFontSize(8);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    
    doc.text(
      `Generated on: ${new Date().toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`,
      margin,
      pageHeight - 10
    );
  };

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i);
  }

  // ==================== SAVE PDF ====================
  const fileName = `Jharkhand_Itinerary_${title.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};
