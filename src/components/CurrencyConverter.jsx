import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import "./CurrencyConverter.css";
//dsimport Select from "react-select";
import currencies from "../currencies";
import CurrencySelect from "./CurrencySelect";
function CurrencyConverter() {
  const [rate, setRate] = useState(0);
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState("0.00");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState("");
  const [history, setHistory] = useState(() => {
  const saved = localStorage.getItem("history");
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const convertCurrency = async () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://open.er-api.com/v6/latest/${fromCurrency}`
      );

      const data = await response.json();

      if (data.result === "success") {
        const rate = data.rates[toCurrency];
        setRate(rate);
        const convertedAmount = (Number(amount) * rate).toFixed(2);
        setResult(`${toCurrency} ${convertedAmount}`);
        setExchangeRate(`1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`);
        setHistory((prev) => [
          `${amount} ${fromCurrency} → ${toCurrency} = ${convertedAmount}`,
          ...prev.slice(0, 4),
        ]);
      } else {
        toast.error("Unable to fetch exchange rates.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);
  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };
  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast.success("Result copied successfully!");
    } catch (err) {
      toast.error("Copy failed!");
    }
  };
  const toggleFavorite = () => {
    if (favorites.includes(fromCurrency)) {
      setFavorites(favorites.filter((item) => item !== fromCurrency));
      toast.info("Removed from favorites");
    } else {
      setFavorites([...favorites, fromCurrency]);
      toast.success("Added to favorites");
    }
  };


  return (
    <div className={darkMode ? "container dark" : "container"}>
      <div className="converter-card">
        <div style={{ textAlign: "right", marginBottom: "15px" }}>
          <button
          className="dark-btn"
          onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
        <h1>💱 Currency Converter</h1>
        <p>Convert currencies in real time</p>
        {favorites.length > 0 && (
          <div className="history">
            <h3>⭐ Favorite Currencies</h3>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {favorites.map((item, index) => (
                <button
                  key={index}
                  className="copy-btn"
                  onClick={() => setFromCurrency(item)}
                >
                  {item}
                </button>
              ))}
           </div>
         </div>
        )}


        <input
          type="number"
          placeholder="Enter Amount"
          className="amount-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="currency-row">
            <CurrencySelect
            currencies={currencies}
            value={fromCurrency}
            onChange={setFromCurrency}
            />
            <button
            className="swap-btn"
            onClick={() => {
                setFromCurrency(toCurrency);
                setToCurrency(fromCurrency);
            }}
        >
            ⇄
        </button>
        <CurrencySelect
        currencies={currencies}
        value={toCurrency}
        onChange={setToCurrency}
        />
        </div>

        <button
            className="convert-btn"
            onClick={convertCurrency}
            disabled={loading}
        >
            {loading ? "Converting..." : "Convert"}
        </button>

        <div className="result-card">
          <div className="result-title">💱 Converted Amount</div>
          <div className="result-value">
            {result}
          </div>
          {exchangeRate && (
            <div className="result-rate">
              {exchangeRate}
            </div>
          )}
        </div>
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <button
        className="copy-btn"
        onClick={copyResult}
        style={{ flex: 1 }}
      >
        📋 Copy
      </button>

  <button
    className="copy-btn"
    onClick={toggleFavorite}
    style={{ flex: 1 }}
  >
    {favorites.includes(fromCurrency)
      ? "⭐ Remove"
      : "☆ Favorite"}
  </button>
</div>
   
        
       {/*} {exchangeRate && (
          <div style={{ marginTop: "30px" }}>
            <ExchangeChart rate={rate} />
            </div>
        )}*/}
        {history.length > 0 && (
          <div className="history">
            <h3>Recent Conversions</h3>
            <ul>
              {history.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
       <p className="developer">
         💙 Developed with React by <strong>Manyam Prashar</strong>
       </p>
    
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme={darkMode ? "dark" : "light"}
      /> 

      </div>
       <ToastContainer
       position="top-right"
       autoClose={2000}
       theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default CurrencyConverter;
