import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export const ControlledTextField = ({
  label,
  multiline,
  rows,
  name,
  control,
  children,
  rules,
  defaultValue,
  ...rest
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => {
        return (
          <TextField
            label={label}
            variant="outlined"
            fullWidth
            multiline={multiline}
            rows={rows}
            {...field}
            required={!!rules?.required}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            value={field.value || ""}
            {...rest}
          >
            {children}
          </TextField>
        );
      }}
    />
  );
};
