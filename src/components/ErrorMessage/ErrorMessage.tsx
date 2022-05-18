import { Container, Grid, Typography, CardMedia } from '@mui/material';
import { useTranslation } from 'react-i18next';
import errImg from '../../assets/images/error-page.jpg';

const ErrorMessage = () => {
  const { t } = useTranslation();
  return (
    <Container
      maxWidth="lg"
      sx={{
        height: 'calc(100vh - 132.5px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'gray',
      }}
    >
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Typography variant="h3">{t('ERROR_BOUNDARY_MSG')}</Typography>
        </Grid>
        <Grid item>
          <CardMedia component="img" height="140" image={errImg} alt="error-page" />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ErrorMessage;
