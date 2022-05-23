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
import { IFilters } from '../pages/SingleBoardPage';
import SearchIcon from '@mui/icons-material/Search';

type IProps = {
  filters: IFilters;
  setFilters: (filters: IFilters) => void;
  usersIdCreatedTasks: string[];
};

const Toolbar = ({ filters, setFilters, usersIdCreatedTasks }: IProps) => {
  const { title } = useAppSelector((state) => state.boards.singleBoard);
  const { usersAll } = useAppSelector((state) => state.boards);

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
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
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

  const usersCreatedTasks = usersIdCreatedTasks.map((id) => {
    const user = usersAll.find((user) => user.id === id);
    return user;
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
      columns={{ xs: 1, sm: 2, md: 4, lg: 6, xl: 6 }}
      sx={{
        '@media only screen and (max-width: 600px)': {
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <Grid item container direction="row">
        <DashboardRoundedIcon sx={{ color: '#303F9F' }} />
        <Typography align="left" variant="h5" sx={{ fontWeight: 'bold', color: '#303F9F' }}>
          {title.slice(2)}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <FormControl
          sx={{
            m: 1,
            width: 250,
            height: 50,
            p: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <InputLabel id="demo-multiple-checkbox-label" sx={{ p: 0, m: 0, color: 'darkblue' }}>
            {usersCreatedTasks.length ? 'Select users' : 'No tasks'}
          </InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Select users" />}
            renderValue={(selected) => selected.join(', ')}
            disabled={usersCreatedTasks.length === 0}
            sx={{ width: '280px', height: '40px', p: 0, m: 0 }}
          >
            {usersCreatedTasks?.map((user, idx) => (
              <MenuItem key={`${user?.id}/${idx}`} value={user?.name} sx={{ p: 0, m: 0 }}>
                <Checkbox checked={personName.indexOf(user?.name || '') > -1} />
                <ListItemText primary={user?.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={1}>
        <Search sx={{ border: '2px solid #3f51b5', m: 1, width: 280, height: 40, p: 0 }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            value={filters.searchText}
            autoFocus={true}
            inputProps={{ 'aria-label': 'search' }}
            onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
          />
        </Search>
      </Grid>
    </Grid>
  );
};

export default Toolbar;
