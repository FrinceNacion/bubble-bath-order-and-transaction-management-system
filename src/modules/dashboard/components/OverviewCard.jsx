
function OverviewCard({ className, title, value, icon, color }) {
  return (
    <div className={`card border-0 shadow-sm rounded-3 p-4 d-flex justify-content-between align-items-center ${className}`} style={{ minWidth: 150, flex: '1 1 150px' }}>
      <div className="text-secondary small mb-1">{title}</div>
      <div className="d-flex flex-row w-100 justify-content-evenly align-items-center m-2">
        <div className={`d-inline-flex align-items-center justify-content-center rounded-3 bg-${color} bg-opacity-10 text-${color} p-2`} style={{ minWidth: 46, minHeight: 46 }}>
          <i className={`bi ${icon} fs-5`}></i>
        </div>
        <div className="h4 mb-0">{value}</div>
      </div>
    </div>
  );
}

export default OverviewCard;