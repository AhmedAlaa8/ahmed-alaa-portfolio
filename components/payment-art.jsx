export default function PaymentArt({ labels }) {
  return (
    <div className="payment-flow">
      <div className="payment-flow-heading">{labels.transaction}</div>
      <div className="payment-flow-row">
        <span className="payment-flow-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <path d="M3 10h18M7 15h4" />
          </svg>
        </span>
        <div>
          <strong>{labels.payment}</strong>
          <span>{labels.paymentDirection}</span>
        </div>
      </div>
      <div className="payment-flow-row refund-row">
        <span className="payment-flow-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M7 8a7 7 0 1 1-2 7M3 4v5h5" />
            <path d="m9 13 2 2 4-4" />
          </svg>
        </span>
        <div>
          <strong>{labels.refund}</strong>
          <span>{labels.refundDirection}</span>
        </div>
      </div>
    </div>
  );
}
