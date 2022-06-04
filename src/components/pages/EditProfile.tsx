import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import ConformModal from '../ConformModal';
import { propsSubmitSignUp } from '../Login/SignUp';
import { deleteCurrentUser, logOut, updateUser } from '../../store/slices/authReduser';

const EditProfile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isOpenConformModal, setIsOpenConformModal] = useState(false);
  const { id, name, pending, login } = useAppSelector((state) => state.auth);

  const onSubmit = (data: propsSubmitSignUp) => {
    dispatch(
      updateUser({
        login: data.email,
        password: data.password,
        name: data.name,
      })
    );
  };

  const deleteUser = async () => {
    await dispatch(deleteCurrentUser(id));
    dispatch(logOut());
    navigate('/');
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<propsSubmitSignUp>({ mode: 'onSubmit', defaultValues: { name: name, email: login } });
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography component="h2" variant="h5" sx={{ fontStyle: 'italic' }}>
          {t('EDIT_PROFILE')}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="standard"
            size="small"
            required
            error={!!errors?.name?.message}
            helperText={errors?.name?.message ? errors?.name?.message : ' '}
            margin="normal"
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
            variant="standard"
            size="small"
            required
            error={!!errors?.email?.message}
            helperText={errors?.email?.message ? errors?.email?.message : ' '}
            fullWidth
            autoComplete="username"
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
            variant="standard"
            size="small"
            required
            error={!!errors.password}
            helperText={errors.password?.message ? errors.password?.message : ' '}
            fullWidth
            label={t('FORM.PASSWORD')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
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
            color="success"
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
            {t('UPDATE_BTN')}
          </LoadingButton>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={() => setIsOpenConformModal(true)}
          >
            {t('SIGNUP.DELETE')}
          </Button>
          <ConformModal
            isOpen={isOpenConformModal}
            close={() => setIsOpenConformModal(false)}
            func={deleteUser}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default EditProfile;
