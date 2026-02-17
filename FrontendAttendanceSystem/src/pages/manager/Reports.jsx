import "./ManagerPages.css";
import api from "../../utils/api";

export default function Reports() {

  const downloadCSV = async () => {
    try {
      const response = await api.get("/attendance/download", {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Payroll_Report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      alert("Download failed");
      console.log(err);
    }
  };

  return (
    <div className="page-center">
      <div className="card report-card">
        <h1>Payroll Report</h1>
        <p>Download full employee attendance payroll sheet.</p>

        <button className="download-btn" onClick={downloadCSV}>
          Download Report
        </button>
      </div>
    </div>
  );
}
