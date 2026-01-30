import { MONTHLY_QUOTES } from "../constants/monthlyQuotes";

export default function MonthlyQuote({ month }) {
  const quoteData =
    MONTHLY_QUOTES.find(q => q.month === month) || MONTHLY_QUOTES[0];

  return (
    <div
      style={{
        background: quoteData.gradient,
        borderRadius: "16px",
        padding: "32px",
        marginTop: "30px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h3
        style={{
          color: quoteData.colors.chapter,
          fontWeight: 700,
          marginBottom: "14px",
          fontSize: "1.2rem",
        }}
      >
        {quoteData.chapter}
      </h3>

      <p
        style={{
          color: quoteData.colors.quote,
          fontSize: "1.1rem",
          lineHeight: 1.6,
          marginBottom: "14px",
        }}
      >
        “{quoteData.quote}”
      </p>

      <p
        style={{
          color: quoteData.colors.author,
          textAlign: "right",
          fontWeight: 600,
          marginBottom: "18px",
        }}
      >
        — {quoteData.author}
      </p>

      <p
        style={{
          color: quoteData.colors.message,
          fontSize: "0.95rem",
          lineHeight: 1.6,
        }}
      >
        <strong>Message:</strong> {quoteData.message}
      </p>
    </div>
  );
}
