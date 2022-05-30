import { useNavigate } from 'react-router-dom';
import { IconButton, Button, useMediaQuery } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { logOut } from '../../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux.hooks';
import HeaderTooltip from './HeaderTooltip';
import { useTranslation } from 'react-i18next';

const LoginMenu = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const matches = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation();

  return (
    <div>
      {!matches && <HeaderTooltip />}
      <IconButton
        sx={{ p: 0 }}
        onClick={() => {
          dispatch(logOut());
        }}
      >
        {isLoggedIn && !matches && (
          <LogoutIcon
            sx={{
              color: 'white',
              width: { xs: '2rem', sm: '3rem' },
              height: '3rem',
              marginLeft: { xs: '0.5rem', sm: '1rem' },
              transition: '.4s',
              '&:hover': { color: 'primary.contrastText' },
            }}
          />
        )}
      </IconButton>
      {isLoggedIn ? (
        <Button
          onClick={() => navigate('/boards')}
          variant="contained"
          sx={{
            ml: 1,
            backgroundColor: '#5c6bc0',
            color: 'white',
            '@media only screen and (max-width: 450px)': {
              p: 0,
              m: 0.5,
            },
          }}
        >
          {t('GO_TO_MAIN')}
        </Button>
      ) : (
        <>
          <Button
            onClick={() => navigate('/signin')}
            variant="contained"
            sx={{
              mr: 1,
              backgroundColor: '#5c6bc0',
              color: 'white',
              '@media only screen and (max-width: 450px)': {
                p: 0,
                ml: 0.5,
              },
            }}
          >
            {t('LOGIN.HEADER')}
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/signup')}
            sx={{
              backgroundColor: '#5c6bc0',
              color: 'white',
              '@media only screen and (max-width: 450px)': {
                p: 0,
                mr: 0.5,
              },
            }}
          >
            {t('SIGNUP.HEADER')}
          </Button>
        </>
      )}
    </div>
  );
};

export default LoginMenu;
