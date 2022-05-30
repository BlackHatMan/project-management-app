import React, { useState, useEffect } from 'react';
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
import { createToken, createUser } from '../../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { NavLink, useNavigate } from 'react-router-dom';
import { localStorageSetUser, localStorageSetUserToken } from '../../utils/localStorage';
import { useTranslation } from 'react-i18next';

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<propsSubmitSignUp>({ mode: 'onSubmit' });

  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const { id, name, token, pending, isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/boards');
    }
  }, [navigate, isLoggedIn]);

  const onSubmit = async (data: propsSubmitSignUp) => {
    const rejectMsg = await dispatch(
      createUser({
        login: data.email,
        password: data.password,
        name: data.name,
      })
    );

    if (rejectMsg.meta.requestStatus !== 'rejected') {
      await dispatch(createToken({ login: data.email, password: data.password }));
      navigate('/boards');
    }
  };

  useEffect(() => {
    return () => {
      localStorageSetUser({ id: id, name: name });
      localStorageSetUserToken(token);
    };
  }, [id, name, token]);

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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.contrastText' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
          {t('SIGNUP.HEADER')}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            error={Boolean(errors?.name?.message)}
            helperText={errors?.name?.message ? errors?.name?.message : ' '}
            margin="normal"
            required
            fullWidth
            id="name"
            label={t('SIGNUP.NAME')}
            autoFocus
            {...register('name', {
              required: { value: true, message: `${t('FORM.REQUIRE_MSG')}` },
              minLength: {
                value: 3,
                message: `${t('FORM.NAME_LIMIT')}`,
              },
            })}
          />
          <TextField
            error={Boolean(errors?.email?.message)}
            helperText={errors?.email?.message ? errors?.email?.message : ' '}
            margin="normal"
            required
            fullWidth
            autoComplete="email"
            id="email"
            label={t('FORM.EMAIL')}
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
            autoComplete="current-password"
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
            endIcon={<SendIcon />}
            loading={pending}
            loadingPosition="end"
            sx={{
              mt: 3,
              mb: 2,
              ':hover': {
                color: 'white',
              },
            }}
          >
            {t('SIGNUP.HEADER')}
          </LoadingButton>
          <Button component={NavLink} to={'/signin'}>
            <Typography variant="body2">{t('SIGNUP.ACCOUNT_EXIST_MSG')}</Typography>
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
export default SignUp;
export type propsSubmitSignUp = {
  email: string;
  password: string;
  name: string;
};
