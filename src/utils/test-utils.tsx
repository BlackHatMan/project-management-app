import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, screen, prettyDOM, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '../setupi18n';
import { store } from '../store/store';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const AllTheProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </Provider>
    </BrowserRouter>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export { customRender as render, screen, userEvent, prettyDOM, fireEvent };
