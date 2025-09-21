import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { Form } from '../types/general';

import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { buildYupSchema } from '../utils/yupBuilder';

interface Props {
  form: Form;
  onSubmit?: (values: any) => void;
}

export const FormRenderer: FC<Props> = ({ form, onSubmit }) => {
  const validationSchema = useMemo(() => buildYupSchema(form), [form]);

  const { control, handleSubmit, watch, formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {}
  });

  // watch all fields so we can compute conditional visibility
  const allValues = watch();

  const isVisible = (elId: string) => {
    const el = form.elements.find((e) => e.id === elId);
    if (!el || !el.conditions || el.conditions.length === 0) return true;

    return el.conditions.every((cond) => {
      const targetElement = form.elements.find((e) => e.id === cond.targetElementId);
      const targetValue = allValues[cond.targetElementId];

      if (!targetElement) return false;

      if (targetElement.type === 'checkbox' && targetElement.choices?.length) {
        // checkbox group -> targetValue is array of choice IDs
        return Array.isArray(targetValue) && targetValue.includes(cond.valueToMatch);
      }

      // single checkbox (boolean) or text
      return targetValue === cond.valueToMatch;
    });
  };

  const handleFormSubmit = (vals: any) => {
    if (onSubmit) onSubmit(vals);
    else console.log('Form submitted', vals);
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }} textTransform='uppercase'>{form.name}</Typography>

        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          {form.elements.map((el) => {
            if (!isVisible(el.id)) return null;

            switch (el.type) {
              case 'text':
                return (
                  <Controller
                    key={el.id}
                    name={el.id}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={el.label}
                        margin="normal"
                        error={!!errors[el.id]}
                        helperText={errors[el.id]?.message as string | undefined}
                      />
                    )}
                  />
                );

              case 'checkbox':
                // inside FormRenderer.tsx, case 'checkbox' for choices
                if (el.choices && el.choices.length > 0) {
                  return (
                    <Controller
                      key={el.id}
                      name={el.id}
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => {
                        const value: string[] = field.value || [];

                        return (
                          <FormGroup>
                            <Typography sx={{ mt: 2 }}>{el.label}</Typography>
                            {el.choices!.map((c) => {
                              const val = c.name.toLowerCase().replace(/\s+/g, '-'); // convert label to value
                              return (
                                <FormControlLabel
                                  key={c.id}
                                  control={
                                    <Checkbox
                                      checked={value.includes(val)}
                                      onChange={(e) => {
                                        const newVal = e.target.checked
                                          ? [...value, val]
                                          : value.filter((v) => v !== val);
                                        field.onChange(newVal);
                                      }}
                                    />
                                  }
                                  label={c.name} // show original label
                                />
                              );
                            })}
                            {errors[el.id] && (
                              <Typography variant="caption" color="error">
                                {errors[el.id]?.message as string}
                              </Typography>
                            )}
                          </FormGroup>
                        );
                      }}
                    />
                  );
                }
                else {
                  // single boolean checkbox
                  return (
                    <Controller
                      key={el.id}
                      name={el.id}
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox {...field} checked={!!field.value} />}
                          label={el.label}
                        />
                      )}
                    />
                  );
                }

              default:
                return null;
            }
          })}

          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
