import React, { useState } from 'react';
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
import { createToken } from '../../store/slice/authSlice';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<propsSubmitLogin>({ mode: 'onSubmit' });

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
    <Container maxWidth="xs" sx={{ mt: '1rem', pb: 3, height: 'calc(100vh - 196px)' }}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            error={Boolean(errors?.email?.message)}
            helperText={errors?.email?.message ? errors?.email?.message : ' '}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoFocus
            {...register('email', {
              required: { value: true, message: 'this field is required' },
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'incorrect email',
              },
            })}
          />
          <TextField
            error={Boolean(errors.password)}
            helperText={errors.password?.message ? errors.password?.message : ' '}
            margin="normal"
            required
            fullWidth
            label="Password"
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
              required: { value: true, message: 'this field is required' },
              minLength: {
                value: 6,
                message: 'Your password must be at least 6 characters long',
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
            Login
          </LoadingButton>
          <Button component={NavLink} to={'/signup'}>
            <Typography variant="subtitle2">{"Don't have an account? Sign Up"}</Typography>
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
