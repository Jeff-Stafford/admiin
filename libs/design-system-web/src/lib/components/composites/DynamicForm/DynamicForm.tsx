import React, { ForwardedRef, forwardRef, useImperativeHandle } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../../primatives/Button/Button';
import { DynamicInput, DynamicInputProps } from '../DynamicInput/DynamicInput';

export interface DynamicFormRef {
  resetForm: () => void;
}

export interface FormInputsProps {
  inputs: DynamicInputProps[];
  btnTitle: string;
  loading: boolean;
  onSubmit: (data: any) => Promise<void>;
}
export const DynamicForm = forwardRef(
  (
    { btnTitle, inputs, loading, onSubmit }: FormInputsProps,
    ref: ForwardedRef<any>
  ) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
      mode: 'onSubmit',
      reValidateMode: 'onChange',
    });
    useImperativeHandle(ref, () => ({
      resetForm() {
        reset();
      },
    }));

    return (
      <form onSubmit={handleSubmit(onSubmit)} ref={ref}>
        {inputs?.map((input) => (
          <Controller
            key={input.name}
            control={control}
            name={input.name}
            rules={input.rules}
            defaultValue={input.defaultValue}
            render={({ field }) => (
              <DynamicInput
                {...field}
                error={!!errors?.[input.name]?.message}
                type={input.type}
                //TODO: change the way props are used? e.g. props.props
                label={input.label}
                placeholder={input.placeholder}
                options={input?.options || []}
              />
            )}
          />
        ))}

        <Button
          loading={loading}
          onClick={handleSubmit(onSubmit)}
          sx={{
            mt: 2,
          }}
        >
          {btnTitle}
        </Button>
      </form>
    );
  }
);
