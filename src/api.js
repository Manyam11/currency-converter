const BASE_URL = "https://open.er-api.com/v6/latest";

export async function convertCurrency(from, to, amount) {
  const response = await fetch(`${BASE_URL}/${from}`);
  const data = await response.json();

  if (data.result !== "success") {
    throw new Error("Unable to fetch exchange rates");
  }

  const rate = data.rates[to];
  return (amount * rate).toFixed(2);
}