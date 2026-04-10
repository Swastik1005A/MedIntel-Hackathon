import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/data/medicines";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface DownloadReportProps {
  result: AnalysisResult;
  results?: AnalysisResult[];
}

const DownloadReport = ({ result, results }: DownloadReportProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPDF = async () => {
    const reportElement = document.getElementById("report-content");
    if (!reportElement) return;

    setIsExporting(true);
    try {
        const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        
        const fileName = results && results.length > 1
          ? `MedIntel-Multi-Report.pdf`
          : `MedIntel-Report-${result.original.name.replace(/\s+/g, "-")}.pdf`;
          
        pdf.save(fileName);
    } catch (error) {
        console.error("PDF generation failed", error);
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <section className="py-6 mb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button 
            onClick={handleDownloadPDF} 
            disabled={isExporting}
            variant="outline" 
            className="w-full py-6 h-auto rounded-xl font-bold flex items-center justify-center gap-3 text-primary border-primary/20 hover:bg-primary/5 transition"
        >
          <FileDown className="w-5 h-5" />
          {isExporting ? "Generating PDF Report..." : "Download Clinical Report"}
        </Button>
      </div>
    </section>
  );
};

export default DownloadReport;
