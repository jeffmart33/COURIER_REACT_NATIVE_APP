export const formatMoney = (amount, currency = "NGN") => {
  const symbol = currency === "EUR" ? "€" : "₦";

  const value = Number(amount) || 0;

  return `${symbol}${value.toLocaleString("en-NG", {
    maximumFractionDigits: 2,
  })}`;
};
