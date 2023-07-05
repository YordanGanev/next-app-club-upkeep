import Async, { useAsync } from "react-select/async";

import Select from "react-select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimeField } from "@mui/x-date-pickers/TimeField";

const selectStyles = {};

function Input({ inputProps, handleChange }) {
  switch (inputProps?.type) {
    case "asyncSelect":
      return (
        <Async
          key={`async-${inputProps?.name}`}
          required={inputProps?.required}
          placeholder={inputProps?.placeholder}
          loadOptions={inputProps?.loadOptions}
          isMulti={true}
          onChange={(ValueType) => {
            // console.error(ValueType);

            let selectedValues = ValueType.map((opt) => opt.value);

            handleChange(null, {
              name: inputProps?.name,
              value: selectedValues,
            });
          }}
          className="multi-select-container"
          classNamePrefix="multi-select"
        />
      );
    case "Select":
      return (
        <Select
          key={`async-${inputProps?.name}`}
          required={inputProps?.required}
          placeholder={inputProps?.placeholder}
          onChange={(option) => {
            handleChange(null, { name: inputProps?.name, value: option.value });
          }}
          options={inputProps?.options}
          className="multi-select-container"
          classNamePrefix="multi-select"
        ></Select>
      );
    case "Date":
      return (
        <DatePicker
          {...inputProps}
          onChange={(newDate) => {
            handleChange(null, {
              name: inputProps?.name,
              value: newDate,
            });
          }}
        />
      );
    case "Time":
      return (
        <TimeField
          format={inputProps?.format}
          placeholder={inputProps?.placeholder}
          required={inputProps?.required}
          onChange={(time) => {
            console.log(time);
            handleChange(null, {
              name: inputProps?.name,
              value: time,
            });
          }}
        />
      );
    default:
      return (
        <input
          {...inputProps}
          key={`select-${inputProps?.key}`}
          onChange={handleChange}
        />
      );
  }
}

export default Input;
