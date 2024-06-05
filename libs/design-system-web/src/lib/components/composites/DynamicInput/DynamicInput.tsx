import React, { ChangeEventHandler } from 'react';
import { FieldValues } from 'react-hook-form';
import { Checkbox } from '../../primatives/Checkbox/Checkbox';
import { Radio } from '../../primatives/Radio/Radio';
import { Select } from '../../primatives/Select/Select';
import { TextField } from '../TextField/TextField';

export enum DynamicInputType {
  checkbox = 'checkbox',
  text = 'text',
  select = 'select',
  radio = 'radio',
}

export interface DynamicInputProps extends FieldValues {
  type: DynamicInputType;
  label?: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  options?: { value: string | number; label: string; group?: string }[];
  rules?: any; //TODO: rules type
}

export interface ControlledDynamicInputProps extends DynamicInputProps {
  onChange?: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >; //TODO: Refactor inter another type / interface? as set by <Controller/.
  value?: any; //TODO: Refactor inter another type / interface? as set by <Controller/.
  error?: boolean;
}

export const DynamicInput = ({
  type,
  value,
  label,
  placeholder,
  options,
  error,
  onChange,
}: ControlledDynamicInputProps) => {
  switch (type) {
    case DynamicInputType.text:
      return (
        <TextField
          label={label}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          error={error}
          margin="dense"
        />
      );
    case DynamicInputType.radio:
      return (
        //eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {options?.map((e) => (
            <Radio
              key={e.value}
              label={e.label}
              value={e.value}
              onChange={onChange}
              checked={value === e.value}
            />
          ))}
        </>
      );
    case DynamicInputType.select:
      return (
        <Select
          label={label}
          placeholder={placeholder}
          options={options}
          onChange={onChange}
          value={value}
          error={error}
          margin="dense"
        />
      );

    case DynamicInputType.checkbox:
      return <Checkbox label={label} onChange={onChange} checked={value} />;

    default:
      return (
        <TextField
          label={label}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          error={error}
          margin="dense"
        />
      );
  }
};
