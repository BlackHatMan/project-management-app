import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  InputAdornment,
  IconButton,
  TextField,
  Box,
  Container,
  Typography,
  Button,
  Avatar,
  CssBaseline,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { createToken } from '../../store/slices/authSlice';
import { useTranslation } from 'react-i18next';

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<propsSubmitLogin>({ mode: 'onSubmit' });

  const { t } = useTranslation();
  const state = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const path: string | unknown = useLocation().state;
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: propsSubmitLogin) => {
    const rename = {
      login: data.email, // email это поле login на сервере
      password: data.password,
    };
    await dispatch(createToken(rename));

    if (path === 'string') {
      navigate(path, { replace: true });
    } else {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          height: 'calc(100vh - 132.5px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
          {t('LOGIN.HEADER')}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            error={Boolean(errors?.email?.message)}
            helperText={errors?.email?.message ? errors?.email?.message : ' '}
            margin="normal"
            required
            fullWidth
            id="email"
            label={t('FORM.EMAIL')}
            autoFocus
            {...register('email', {
              required: { value: true, message: `${t('FORM.REQUIRE_MSG')}` },
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: `${t('FORM.INCORRECT_EMAIL')}`,
              },
            })}
          />
          <TextField
            error={Boolean(errors.password)}
            helperText={errors.password?.message ? errors.password?.message : ' '}
            margin="normal"
            required
            fullWidth
            label={t('FORM.PASSWORD')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prevState) => !prevState)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...register('password', {
              required: { value: true, message: `${t('FORM.REQUIRE_MSG')}` },
              minLength: {
                value: 6,
                message: `${t('FORM.PASSWORD_LIMIT')}`,
              },
            })}
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            endIcon={<SendIcon />}
            loading={state.pending}
            loadingPosition="end"
          >
            {t('LOGIN.HEADER')}
          </LoadingButton>
          <Button component={NavLink} to={'/signup'}>
            <Typography variant="subtitle2">{t('LOGIN.ACCOUNT_ABSENCE_MSG')}</Typography>
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

type propsSubmitLogin = {
  email: string;
  password: string;
};
