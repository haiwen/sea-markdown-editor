import checkIsUrl from 'is-url';

export const isMac = () => {
  const platform = navigator.platform;
  return (platform === 'Mac68K') || (platform === 'MacPPC') || (platform === 'Macintosh') || (platform === 'MacIntel');
};

export const IMAGE_TYPES = [
  'png',
  'jpg',
  'gif',
];

export const isImage = (url) => {
  if (!url) return false;

  if (!isUrl(url)) return false;

  const suffix = url.split('.')[1]; // http://xx/mm/*.png
  if (!suffix) return false;

  return IMAGE_TYPES.includes(suffix.toLowerCase());
};

export const isUrl = (url) => {
  if (!url) return false;
  if (!url.startsWith('http')) return false;
  if (!checkIsUrl(url)) return false;
  return true;
};
