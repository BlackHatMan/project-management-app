import { useState } from 'react';
import { Box, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { indigo } from '@mui/material/colors';
import { useTranslation, TFuncKey } from 'react-i18next';

type languages = 'en' | 'ru' | 'ua';
const lngs: Record<languages, TFuncKey> = {
  en: 'LANGUAGES.EN',
  ru: 'LANGUAGES.RU',
  ua: 'LANGUAGES.UA',
};

type languagesKeys = keyof typeof lngs;

const LanguageMenu = () => {
  const { t, i18n } = useTranslation();
  const [lng, setLng] = useState(localStorage.getItem('i18nextLng') || 'en');

  const handleChange = (event: SelectChangeEvent) => {
    setLng(event.target.value as string);
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Box mr={{ xs: 0, sm: 5 }}>
      <Select
        value={lng}
        onChange={handleChange}
        sx={{
          m: 1,
          p: 0,
          color: 'white',
          backgroundColor: indigo[400],
          height: '2.5rem',
          transition: '.4s',
          '&:hover': {
            backgroundColor: indigo[700],
          },
          borderRadius: '1rem',
          '& .MuiSvgIcon-root': {
            color: 'white',
          },
        }}
      >
        {Object.keys(lngs).map((lng) => (
          <MenuItem key={lng} value={lng}>
            {t(`${lngs[lng as languagesKeys]}`)}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default LanguageMenu;
