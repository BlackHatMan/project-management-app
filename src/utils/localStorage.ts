import { UserInfo } from '../types/types';

const localStorageSetUser = (userInfo: UserInfo) => {
  const stringifiedValue = JSON.stringify(userInfo);
  localStorage.setItem('userInfo', stringifiedValue);
};
const localStorageSetUserToken = (userToken: string) => {
  localStorage.setItem('userToken', userToken);
};

const localStorageGetUser = () => {
  const storedUser = localStorage.getItem('userInfo');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
};
const localStorageGetUserToken = () => {
  const token = localStorage.getItem('userToken');
  return token !== null ? token : '';
};

const localStorageRemoveUser = () => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('userToken');
};

const localStorageClear = () => {
  localStorage.clear();
};

export {
  localStorageSetUser,
  localStorageSetUserToken,
  localStorageGetUserToken,
  localStorageGetUser,
  localStorageRemoveUser,
  localStorageClear,
};
