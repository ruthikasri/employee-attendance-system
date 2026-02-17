import api from "../../utils/api";

export default function Reports() {

  const downloadReport = async () => {
    try {
      const response = await api.get("/attendance/download", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance-report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error(err);
      alert("Failed to download report");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h1>Payroll Report</h1>
      <button onClick={downloadReport}>Download CSV</button>
    </div>
  );
}
