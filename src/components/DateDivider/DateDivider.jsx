import "./DateDivider.css";

function DateDivider({ label = "Today" }) {
  return (
    <div className="date-divider">

      <div className="divider-line" />

      <span>{label}</span>

      <div className="divider-line" />

    </div>
  );
}

export default DateDivider;