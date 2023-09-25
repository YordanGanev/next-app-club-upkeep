"use client";
import Async, { useAsync } from "react-select/async";

import Select from "react-select";

import "@/styles/multiselect.css";
import "@/styles/mui-react-date.css";

import dayjs from "dayjs";
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
          defaultValue={inputProps?.defaultValue}
          className="multi-select-container"
          classNamePrefix="multi-select"
          inputId={inputProps?.name}
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
            textField: {
              name: inputProps.name,
              required: inputProps.required,
              id: inputProps.name,
            },
          }}
          // fix for getting props from postgress from user table
          // initial value is not in the right format
          defaultValue={dayjs(new Date(inputProps?.value))}
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
          inputId={inputProps?.name}
          onChange={(time) => {
            // console.log(time);
            handleChange(null, {
              name: inputProps?.name,
              value: time,
            });
          }}
        />
      );
    case "textarea":
      return (
        <textarea
          {...inputProps}
          onChange={handleChange}
          // className="textarea"
        />
      );
    default:
      return <input {...inputProps} onChange={handleChange} />;
  }
}

export default Input;
