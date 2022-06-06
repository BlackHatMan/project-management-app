import {
  alpha,
  Checkbox,
  FormControl,
  Grid,
  InputBase,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  styled,
  Typography,
} from '@mui/material';
import React from 'react';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import { useAppSelector } from '../../hooks/redux.hooks';
import { IFilters } from '../../Routes/BoardRoute';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

type IProps = {
  filters: IFilters;
  setFilters: (filters: IFilters) => void;
  usersIdCreatedTasks: string[];
};

const Toolbar = ({ filters, setFilters, usersIdCreatedTasks }: IProps) => {
  const { title } = useAppSelector((state) => state.boards.singleBoard);
  const { usersAll } = useAppSelector((state) => state.boards);
  const { t } = useTranslation();

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6585F3',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'rgb(34 46 168)',
    fontWeight: 700,
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
    },
  }));

  const WhiteBorderTextField = styled(OutlinedInput)(({ theme }) => ({
    textAlign: 'left',
    '& .MuiSelect-select': {
      padding: theme.spacing(1.2, 1, 1.2, 1),
      transition: theme.transitions.create('width'),
    },
    color: 'rgb(34 46 168)',
    fontWeight: 700,
    '& fieldset': {
      borderColor: '#3f51b5',
      borderWidth: '2px',
      backgroundColor: 'rgba(213, 217, 233, .8)',
      zIndex: -1,
    },
    '&:hover fieldset': {
      borderWidth: '1px',
    },
  }));

  const usersCreatedTasks = usersIdCreatedTasks.map((id) => {
    const user = usersAll.find((user) => user.id === id);
    const resultUser = {
      ...user,
      name: user?.name || `${t('FILTER.UNKNOWN_USER')}`,
      id: user?.id || 'deleted',
    };

    return resultUser;
  });

  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    const usersIdChecked = usersCreatedTasks
      .filter((user) => event.target.value.includes(user?.name || ''))
      .map((user) => user?.id || '');
    setFilters({ ...filters, usersId: usersIdChecked });
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      columnSpacing={{ lg: 1 }}
      px={3}
      py={1}
      sx={{
        position: 'fixed',
        top: '68.5px',
        left: '0',
        '@media only screen and (max-width: 900px)': {
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        },
        '@media only screen and (max-width: 600px)': {
          position: 'unset',
        },
      }}
    >
      <Grid
        item
        container
        direction="row"
        lg={6}
        md={4}
        sm={12}
        sx={{
          width: '100%',
          '@media only screen and (max-width: 900px)': {
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <DashboardRoundedIcon sx={{ color: '#303F9F' }} />
        <Typography align="left" variant="h5" sx={{ fontWeight: 'bold', color: '#303F9F' }}>
          {title.slice(2)}
        </Typography>
      </Grid>
      <Grid item lg={3} md={3} sm={6} xs={10} sx={{ width: '100%' }}>
        <FormControl
          sx={{
            mx: 1,
            py: 1,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <InputLabel id="demo-multiple-checkbox-label" sx={{ p: 0, m: 0, color: '#686970' }}>
            {usersCreatedTasks.length ? t('FILTER.SELECT') : t('FILTER.NO_TASKS')}
          </InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={personName}
            onChange={handleChange}
            input={<WhiteBorderTextField label={t('FILTER.SELECT')} />}
            renderValue={(selected) => selected.join(', ')}
            disabled={usersCreatedTasks.length === 0}
          >
            {usersCreatedTasks?.map((user, idx) => (
              <MenuItem
                key={`${user?.id}/${idx}`}
                value={user?.name}
                sx={{
                  p: 0,
                  m: 0,
                }}
              >
                <Checkbox checked={personName.indexOf(user?.name || '') > -1} />
                <ListItemText primary={user?.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item lg={3} md={3} sm={6} xs={10} sx={{ width: '100%' }}>
        <Search
          sx={{
            border: '2px solid #3f51b5',
            mx: 1,
            backgroundColor: 'rgba(213, 217, 233, .7)',
            '&:hover': {
              backgroundColor: 'rgba(213, 217, 233, .9)',
            },
          }}
        >
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder={t('FILTER.SEARCH')}
            value={filters.searchText}
            autoFocus
            inputProps={{ 'aria-label': 'search' }}
            onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
          />
        </Search>
      </Grid>
    </Grid>
  );
};

export default Toolbar;
