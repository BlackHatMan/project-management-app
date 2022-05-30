import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import SnackbarMessage from '../SnackbarMessage';

const Layout = () => {
  return (
    <>
      <div className="wrapper">
        <Header />
        <Outlet />

        <Footer />
      </div>
      <SnackbarMessage />
    </>
  );
};

export default Layout;
