export default function InvestmentArt({ labels }) {
  const steps = [labels.request, labels.execution, labels.settlement];
  return (
    <div className="investment-ledger">
      <div className="ledger-heading">
        <span className="ledger-seal">04</span>
        <span>{labels.flowTitle}</span>
      </div>
      <div className="ledger-stages">
        {steps.map((label, index) => (
          <div className="ledger-stage" key={index}>
            <span className="ledger-node">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{label}</span>
            <i />
          </div>
        ))}
      </div>
      <div className="ledger-note">{labels.flowNote}</div>
    </div>
  );
}
