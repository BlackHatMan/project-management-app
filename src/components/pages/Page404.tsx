import { useLocation, Link } from 'react-router-dom';
import { Container, Button, Typography } from '@mui/material';

import { useTranslation } from 'react-i18next';

const boardPath = '/not-found-board';

const Page404 = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isFromBoard = pathname === boardPath;

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: 'calc(100vh - 132.5px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h6" mb={2} sx={{ color: 'gray' }}>
        {t('NOT_FOUND_PAGE')}
      </Typography>
      {isFromBoard ? (
        <Button variant="contained" component={Link} to="/boards">
          {t('BACK_TO_BOARDS')}
        </Button>
      ) : (
        <Button variant="contained" component={Link} to="/">
          {t('BACK_TO_MAIN')}
        </Button>
      )}
    </Container>
  );
};

export default Page404;
