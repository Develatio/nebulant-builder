import Form from "react-bootstrap/esm/Form";

export const OperatorSelector = ({ handleOnChange, value, options }) => {
  return (
    <Form.Select
      id={`operator-${Math.random()}`}
      value={value}
      onChange={(e) => handleOnChange(e.target.value)}
    >
      {
        options.map(option =>
          <option key={option.name} value={option.name}>{option.label}</option>
        )
      }
    </Form.Select>
  );
};
