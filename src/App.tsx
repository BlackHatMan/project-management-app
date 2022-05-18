import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { WelcomePage, EditProfile, Page404, BoardsPage, SingleBoardPage } from './components/pages';
import { Login, SignUp } from './components';
import RequireAuth from './hoc/RequireAuth';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<WelcomePage />} />
        <Route
          path="edit-profile"
          element={
            <ErrorBoundary>
              <RequireAuth>
                <EditProfile />
              </RequireAuth>
            </ErrorBoundary>
          }
        />
        <Route path="edit" element={<Navigate to="/edit-profile" replace />} />
        <Route
          path="boards"
          element={
            <ErrorBoundary>
              <RequireAuth>
                <BoardsPage />
              </RequireAuth>
            </ErrorBoundary>
          }
        />
        <Route
          path="boards/:boardId"
          element={
            <ErrorBoundary>
              <SingleBoardPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="login"
          element={
            <ErrorBoundary>
              <Login />
            </ErrorBoundary>
          }
        />
        <Route
          path="signup"
          element={
            <ErrorBoundary>
              <SignUp />
            </ErrorBoundary>
          }
        />
        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
}

export default App;
