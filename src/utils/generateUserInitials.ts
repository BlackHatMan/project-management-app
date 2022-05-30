export const generateUserInitials = (userInfo: string) => {
  const arr = userInfo.split(' ');
  return arr.map((word) => word[0].toUpperCase()).join('');
};
