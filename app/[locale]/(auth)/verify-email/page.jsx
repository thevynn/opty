'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema, defaultValues } from './schema';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Input from '@/components/Input';
import Nav from './nav';

export default function Page({ params: { locale } }) {
  const router = useRouter();
  const t = {
    label: useTranslations('FormLabel'),
    page: useTranslations('VerifyEmailPage'),
  };

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = (data) => {
    const { verificationCode } = data;

    console.log(data);

    router.push(`/${locale}/reset-password`);
  };

  return (
    <>
      <Box
        noValidate
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 12,
        }}
      >
        <Typography component="h1" variant="h5" align="center">
          {t.page('title')}
        </Typography>
        <Typography component="p" variant="body2" align="center" color="text.secondary" sx={{ marginTop: 1 }}>
          {t.page('description')}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <Input
              required
              control={control}
              type="text"
              name="verificationCode"
              label={t.label('verification-code')}
              autoFocus
              fullWidth
            />
          </Grid>
        </Grid>
        <Button type="submit" disabled={isSubmitting} variant="contained" size="large" fullWidth sx={{ mt: 3 }}>
          {t.page('submit')}
        </Button>
      </Box>
      <Nav />
    </>
  );
}
