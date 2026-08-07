import Select from "react-select";
import { CircleFlag } from "react-circle-flags";

export default function CurrencySelect({
  currencies,
  value,
  onChange,
}) {
  const options = currencies.map((currency) => ({
    value: currency.code,
    code: currency.code,
    name: currency.name,
    countryCode: currency.countryCode,
  }));

  return (
    <Select
      options={options}
      value={options.find((option) => option.value === value)}
      onChange={(selected) => onChange(selected.value)}
      isSearchable
      placeholder="Search currency..."
      formatOptionLabel={(option) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <CircleFlag
            countryCode={option.countryCode.toLowerCase()}
            height="22"
          />
          <span>
            <strong>{option.code}</strong> - {option.name}
          </span>
        </div>
      )}
      styles={{
        control: (base) => ({
          ...base,
          minHeight: "52px",
          borderRadius: "12px",
          fontSize: "16px",
        }),
      }}
    />
  );
}