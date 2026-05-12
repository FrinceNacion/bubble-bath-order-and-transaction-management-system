import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../../common/services/api';
import OverviewCard from '../../dashboard/components/OverviewCard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { Download, FileText, Table as TableIcon, Filter } from 'lucide-react';
import bubblebathLogo from '../../../assets/bubblebath-icon.png';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportsPage = () => {
  const [reportType, setReportType] = useState('revenue');
  const [dateFilter, setDateFilter] = useState('monthly');
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const [dashboardStats, setDashboardStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [distributionData, setDistributionData] = useState(null);
  const [reportTableData, setReportTableData] = useState([]);

  const fetchData = async () => {
    try {
      // Fetch Dashboard Stats
      const statsRes = await fetch(API_ENDPOINTS.ANALYTICS.GET_DASHBOARD_STATS, {
        method: 'POST',
        credentials: 'include'
      });
      const statsJson = await statsRes.json();
      if (statsJson.success) setDashboardStats(statsJson.data);

      // Fetch Chart Data
      const chartRes = await fetch(API_ENDPOINTS.ANALYTICS.GET_CHART_DATA, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filter: dateFilter })
      });
      const chartJson = await chartRes.json();
      if (chartJson.success) setChartData(chartJson);

      // Fetch Distribution Data
      const distRes = await fetch(API_ENDPOINTS.ANALYTICS.GET_DISTRIBUTION_DATA, {
        method: 'POST',
        credentials: 'include'
      });
      const distJson = await distRes.json();
      if (distJson.success) setDistributionData(distJson);

      // Fetch Detailed Report
      fetchReportTable();

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const fetchReportTable = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.ANALYTICS.GET_DETAILED_REPORT, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: reportType, start_date: startDate, end_date: endDate })
      });
      const json = await res.json();
      if (json.success) setReportTableData(json.data);
    } catch (error) {
      console.error('Error fetching report table:', error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter]);

  useEffect(() => {
    fetchReportTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType, startDate, endDate]);

  const exportCSV = () => {
    if (reportTableData.length === 0) return;

    const headers = Object.keys(reportTableData[0]);
    const csvContent = [
      headers.join(','),
      ...reportTableData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `report_${reportType}_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    if (reportTableData.length === 0) return;

    const doc = new jsPDF();
    doc.addImage(bubblebathLogo, "PNG", 5, 5, 17, 15);
    doc.setFontSize(18);
    doc.text(`Bubble Bath - ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 20, 20);
    doc.setFontSize(11);
    doc.text(`Period: ${startDate} to ${endDate}`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 35);

    const headers = Object.keys(reportTableData[0]);
    const data = reportTableData.map(row => Object.values(row));

    autoTable(doc, {
      head: [headers.map(h => h.replace('_', ' ').toUpperCase())],
      body: data,
      startY: 45,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [52, 152, 219] }
    });

    doc.save(`report_${reportType}_${startDate}_to_${endDate}.pdf`);
  };

  const lineChartData = {
    labels: chartData?.labels || [],
    datasets: [
      {
        label: 'Revenue (₱)',
        data: chartData?.revenue || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const pieChartData = {
    labels: distributionData?.order_status.map(s => s.status) || [],
    datasets: [
      {
        data: distributionData?.order_status.map(s => s.count) || [],
        backgroundColor: [
          '#ffc107', // pending
          '#17a2b8', // in_progress
          '#007bff', // ready
          '#28a745', // claimed
          '#dc3545', // cancelled
        ],
      }
    ]
  };

  const serviceChartData = {
    labels: distributionData?.service_types.map(s => s.service) || [],
    datasets: [
      {
        label: 'Garments',
        data: distributionData?.service_types.map(s => s.count) || [],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      }
    ]
  };

  const paymentChartData = {
    labels: distributionData?.payment_methods.map(p => p.payment_method) || [],
    datasets: [
      {
        label: 'Transactions',
        data: distributionData?.payment_methods.map(p => p.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
      }
    ]
  };

  return (
    <main className="container flex-fill p-4 p-xl-5">
      <div className="container d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold text-dark mb-1">Business Intelligence & Analytics</h4>
          <p className="text-muted small mb-0">Actionable insights for laundry operations.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 bg-white" onClick={exportCSV}>
            <Download size={16} /> CSV
          </button>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" onClick={exportPDF}>
            <FileText size={16} /> PDF Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <OverviewCard title="Total Orders" value={dashboardStats?.total_orders || "0"} icon="bi-box" color="primary" />
        </div>
        <div className="col-md-3">
          <OverviewCard title="Monthly Revenue" value={`₱ ${parseFloat(dashboardStats?.monthly_revenue || 0).toLocaleString()}`} icon="bi-currency-dollar" color="success" />
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 p-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="text-secondary small mb-1">Growth (MoM)</p>
                <h4 className={`fw-bold mb-0 ${dashboardStats?.revenue_trend >= 0 ? 'text-success' : 'text-danger'}`}>
                  {dashboardStats?.revenue_trend >= 0 ? '+' : ''}{dashboardStats?.revenue_trend || 0}%
                </h4>
              </div>
              <div className={`rounded-circle p-2 ${dashboardStats?.revenue_trend >= 0 ? 'bg-success' : 'bg-danger'} bg-opacity-10`}>
                <i className={`bi ${dashboardStats?.revenue_trend >= 0 ? 'bi-graph-up' : 'bi-graph-down'} ${dashboardStats?.revenue_trend >= 0 ? 'text-success' : 'text-danger'}`}></i>
              </div>
            </div>
            <p className="small text-muted mt-2 mb-0">Compared to last month</p>
          </div>
        </div>
        <div className="col-md-3">
          <OverviewCard title="Active Customers" value={dashboardStats?.active_customers || "0"} icon="bi-people" color="dark" />
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold mb-0">Performance Trend</h6>
              <div className="btn-group btn-group-sm">
                <button
                  className={`btn ${dateFilter === 'daily' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setDateFilter('daily')}
                >7 Days</button>
                <button
                  className={`btn ${dateFilter === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setDateFilter('monthly')}
                >6 Months</button>
              </div>
            </div>
            <div style={{ height: '350px' }}>
              {chartData ? <Line data={lineChartData} options={{
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true } }
              }} /> : <div className="h-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary"></div></div>}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h6 className="fw-bold mb-4">Order Distribution</h6>
            <div style={{ height: '350px' }} className="d-flex align-items-center">
              {distributionData ? <Pie data={pieChartData} options={{
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
              }} /> : <div className="h-100 w-100 d-flex align-items-center justify-content-center"><div className="spinner-border text-primary"></div></div>}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-4">
            <h6 className="fw-bold mb-4">Top Services</h6>
            <div style={{ height: '250px' }}>
              {distributionData ? <Bar data={serviceChartData} options={{ maintainAspectRatio: false, indexAxis: 'y' }} /> : <p>Loading...</p>}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-4">
            <h6 className="fw-bold mb-4">Payment Methods</h6>
            <div style={{ height: '250px' }}>
              {distributionData ? <Bar data={paymentChartData} options={{ maintainAspectRatio: false }} /> : <p>Loading...</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Reports Table */}
      <div className="card border-0 shadow-sm p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h6 className="fw-bold mb-1">Analytical Data Table</h6>
            <p className="text-muted small mb-0">Detailed breakdown of {reportType} records.</p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <select className="form-select form-select-sm w-auto" value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="revenue">Revenue Report</option>
              <option value="orders">Orders Report</option>
              <option value="transactions">Transactions Report</option>
            </select>
            <div className="d-flex gap-1 align-items-center bg-white border rounded px-2">
              <span className="small text-muted">From:</span>
              <input type="date" className="border-0 small" style={{ outline: 'none' }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <span className="small text-muted mx-1">To:</span>
              <input type="date" className="border-0 small" style={{ outline: 'none' }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle border-top">
            <thead className="bg-light">
              <tr>
                {reportTableData.length > 0 && Object.keys(reportTableData[0]).map(header => (
                  <th key={header} className="text-uppercase py-3 px-3" style={{ fontSize: '10px', letterSpacing: '1px', fontWeight: '800', color: '#6c757d' }}>
                    {header.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportTableData.length > 0 ? reportTableData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="small py-3 px-3 text-dark">
                      {typeof val === 'number' && Object.keys(row)[i].includes('amount') ? `₱ ${parseFloat(val).toLocaleString()}` : val}
                    </td>
                  ))}
                </tr>
              )) : (
                <tr>
                  <td colSpan="10" className="text-center py-5 text-muted">
                    <TableIcon size={48} className="mb-3 opacity-25" />
                    <p className="mb-0">No records found for the selected criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default ReportsPage;
