import { Backdrop, CircularProgress } from '@mui/material';

const Loading = () => {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: 100 }} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
