import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import { useForm } from 'react-hook-form';
import { propsSubmitSignUp } from '../Login/SignUp';
import { useEffect, useState } from 'react';
import {
  localStorageGetUser,
  localStorageSetUser,
  localStorageSetUserToken,
} from '../../utils/localStorage';
import SendIcon from '@mui/icons-material/Send';
import { deleteCurrentUser, logOut, updateUser } from '../../store/slices/authSlice';
import ConformModal from '../ConformModal';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const EditProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<propsSubmitSignUp>({ mode: 'onSubmit' });

  const [showPassword, setShowPassword] = useState(false);
  const [isOpenConformModal, setIsOpenConformModal] = useState(false);
  const { id, name, token, pending } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSubmit = async (data: propsSubmitSignUp) => {
    await dispatch(
      updateUser({
        login: data.email,
        password: data.password,
        name: data.name,
      })
    );
  };

  const deleteUser = async () => {
    await dispatch(deleteCurrentUser(id));
    await dispatch(logOut());
    navigate('/');
  };

  useEffect(() => {
    return () => {
      localStorageSetUser({ id: id, name: name });
      localStorageSetUserToken(token);
    };
  }, [id, name, token]);

  // added to check ErrorBoundary need to be removed
  const checkErrorBoundary = () => {
    throw new Error('Something went wrong in Login component');
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
        <Typography component="h1" variant="h4">
          {t('EDIT_PROFILE')}
          {/* need to be removed after checking */}
          {checkErrorBoundary()}
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
            defaultValue={name}
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
            id="email"
            label={t('FORM.EMAIL')}
            defaultValue={() => localStorageGetUser().id}
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
            endIcon={<SendIcon />}
            sx={{ mt: 3, mb: 2 }}
            loading={pending}
            loadingPosition="end"
          >
            {t('UPDATE_BTN')}
          </LoadingButton>
          <Button
            variant="outlined"
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
