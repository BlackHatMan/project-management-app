import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Tooltip, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { generateUserInitials } from '../../utils/generateUserInitials';
import { useAppSelector } from '../../hooks/redux.hooks';

const HeaderTooltip = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, name } = useAppSelector((state) => state.auth);

  return (
    <Tooltip title={t('HEADER.OPEN_SETTINGS')}>
      <IconButton
        onClick={() => {
          isLoggedIn && navigate('/edit-profile');
        }}
        sx={{ p: 0 }}
      >
        {isLoggedIn && (
          <Box
            justifyContent="center"
            alignItems="center"
            sx={{
              display: 'flex',
              width: { xs: '2rem', sm: '3rem' },
              height: { xs: '2rem', sm: '3rem' },
              borderRadius: '50%',
              bgcolor: 'white',
              transition: '.4s',
              '&:hover': {
                bgcolor: 'primary.contrastText',
                '& .MuiTypography-root': {
                  color: 'white',
                },
              },
            }}
          >
            <Typography
              color="primary.contrastText"
              sx={{
                fontWeight: '700',
                fontSize: '1.25rem',
                transition: '.4s',
              }}
            >
              {name && generateUserInitials(name)}
            </Typography>
          </Box>
        )}
      </IconButton>
    </Tooltip>
  );
};

export default HeaderTooltip;
