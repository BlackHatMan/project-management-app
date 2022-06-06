import { Container, Typography, Grid, CardMedia, CardContent, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import bgImage from '../assets/images/bg.webp';
import olgaImg from '../assets/images/olga.jpg';
import victorImg from '../assets/images/victor.jpg';
import evgeniyImg from '../assets/images/eugen.jpg';

import { useTranslation } from 'react-i18next';
import { mainBgColor } from '../constants/constants';

const WelcomeRoute = () => {
  const { t } = useTranslation();
  const developers = [
    {
      name: `${t('DEVELOPERS.VICTOR')}`,
      role: `${t('DEVELOPERS.TEAM_L')}`,
      lingGH: 'https://github.com/BlackHatMan',
      img: victorImg,
    },
    {
      name: `${t('DEVELOPERS.OLGA')}`,
      role: `${t('DEVELOPERS.DEVELOPER')}`,
      lingGH: 'https://github.com/VolhaBukhal',
      img: olgaImg,
    },
    {
      name: `${t('DEVELOPERS.EVGENIY')}`,
      role: `${t('DEVELOPERS.DEVELOPER')}`,
      lingGH: 'https://github.com/EVG777-prog',
      img: evgeniyImg,
    },
  ];
  return (
    <>
      <Container>
        <Grid container flexDirection="column">
          <Grid
            container
            item
            justifyContent="space-between"
            alignItems="center"
            maxWidth="lg"
            sx={{
              height: '95vh',
              '@media only screen and (max-width: 900px)': {
                height: 'auto',
              },
            }}
          >
            <Grid item sm={12} md={5}>
              <Typography
                variant="h3"
                component="h1"
                color={mainBgColor}
                sx={{
                  fontWeight: '700',
                  marginBlock: '2rem',
                  '@media only screen and (max-width: 900px)': {
                    textAlign: 'center',
                  },
                  '@media only screen and (max-width: 600px)': {
                    fontSize: '2rem',
                  },
                }}
              >
                {t('WELCOME.TITLE')}
              </Typography>
              <Typography
                variant="h6"
                component="div"
                color="primary.contrastText"
                sx={{
                  '@media only screen and (max-width: 900px)': {
                    textAlign: 'center',
                  },
                }}
              >
                {t('WELCOME.SUBTITLE')}
                <Typography>{t('WELCOME.INFO')}</Typography>
                <Typography>{t('WELCOME.DESCR')}</Typography>
              </Typography>
            </Grid>
            <Grid item sm={12} md={7} mt={1}>
              <CardMedia component="img" height="100%" image={bgImage} alt="main page bg" />
            </Grid>
          </Grid>
          <Grid container item justifyContent="center">
            <Typography
              variant="h3"
              component="h2"
              align="center"
              mt={2}
              mb={2}
              color={mainBgColor}
              sx={{
                '@media only screen and (max-width: 600px)': {
                  fontSize: '2rem',
                },
              }}
            >
              {t('DEVELOPERS.TEAM')}
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              align="center"
              mt={2}
              mb={2}
              color="text.primary"
            >
              {t('DEVELOPERS.TEAM_DESCR')}
            </Typography>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              maxWidth="lg"
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{
                '@media only screen and (max-width: 850px)': {
                  justifyContent: 'space-evenly',
                  gap: 2,
                },
              }}
            >
              {developers.map((developer) => (
                <Grid item md={4} key={developer.name}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={developer.img}
                    alt={developer.name}
                    sx={{
                      borderRadius: '5%',
                      width: '250px',
                      margin: '0 auto',
                      '@media only screen and (max-width: 555px)': {
                        borderRadius: '50%',
                      },
                    }}
                  />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      color="primary.contrastText"
                    >
                      {developer.name}
                    </Typography>
                    <Grid container justifyContent="center">
                      <Typography variant="h6" color="text.secondary" mr={1}>
                        {developer.role}
                      </Typography>
                      <Link
                        href={developer.lingGH}
                        target="_blank"
                        sx={{
                          transition: '.4s',
                          color: 'secondary.contrastText',
                          '&:hover': { color: 'primary.contrastText' },
                        }}
                      >
                        <GitHubIcon />
                      </Link>
                    </Grid>
                  </CardContent>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default WelcomeRoute;
