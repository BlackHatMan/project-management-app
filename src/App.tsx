import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout, Login, ErrorBoundary, SignUp } from './components';
import WelcomeRoute from './Routes/WelcomeRoute';
import BoardsRoute from './Routes/BoardsRoute';
import RequireAuth from './hoc/RequireAuth';
import Loading from './hoc/Loading';

const Page404 = lazy(() => import('./Routes/Page404'));
const BoardRoute = lazy(() => import('./Routes/BoardRoute'));
const ProfileRoute = lazy(() => import('./Routes/ProfileRoute'));

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomeRoute />} />
          <Route
            path="edit-profile"
            element={
              <ErrorBoundary>
                <RequireAuth>
                  <Suspense fallback={<Loading />}>
                    <ProfileRoute />
                  </Suspense>
                </RequireAuth>
              </ErrorBoundary>
            }
          />
          <Route
            path="boards"
            element={
              <ErrorBoundary>
                <RequireAuth>
                  <BoardsRoute />
                </RequireAuth>
              </ErrorBoundary>
            }
          />
          <Route
            path="boards/:boardId"
            element={
              <ErrorBoundary>
                <RequireAuth>
                  <Suspense fallback={<Loading />}>
                    <BoardRoute />
                  </Suspense>
                </RequireAuth>
              </ErrorBoundary>
            }
          />
          <Route path="signin" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
