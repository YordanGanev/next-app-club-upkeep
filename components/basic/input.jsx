"use client";
import Async, { useAsync } from "react-select/async";

import Select from "react-select";

import "@styles/multiselect.css";
import "@styles/mui-react-date.css";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimeField } from "@mui/x-date-pickers/TimeField";

function Input({ inputProps, handleChange }) {
  switch (inputProps?.type) {
    case "asyncSelect":
      return (
        <Async
          required={inputProps?.required}
          placeholder={inputProps?.placeholder}
          loadOptions={inputProps?.loadOptions}
          isMulti={true}
          name={inputProps?.name}
          onChange={(ValueType) => {
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
          name={inputProps?.name}
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
          maxDate={inputProps?.maxDate}
          minDate={inputProps?.minDate}
          required={inputProps?.required}
          placeholder={inputProps?.placeholder}
          format={inputProps?.format}
          views={inputProps?.views}
          slotProps={{
            textField: { name: inputProps.name, required: inputProps.required },
          }}
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
          name={inputProps?.name}
          onChange={(time) => {
            // console.log(time);
            handleChange(null, {
              name: inputProps?.name,
              value: time,
            });
          }}
        />
      );
    default:
      return <input {...inputProps} onChange={handleChange} />;
  }
}

export default Input;
