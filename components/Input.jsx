import { useTranslations } from 'next-intl';
import { useController, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';

export default function Input({ control, name, ...rest }) {
  const t = useTranslations('SchemaValidation');
  const {
    field,
    fieldState: { invalid, isTouched, isDirty, error },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
  });

  return (
    <>
      <TextField
        onChange={field.onChange} // send value to hook form
        onBlur={field.onBlur} // notify when input is touched/blur
        value={field.value} // input value
        name={field.name} // send down the input name
        inputRef={field.ref} // send input ref, so we can focus on input when error appear
        {...rest}
      />
      {error && <FormHelperText error={!!error}>{t(error.message)}</FormHelperText>}
    </>
  );
}
