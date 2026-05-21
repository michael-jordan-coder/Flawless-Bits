export const getLanguage = key => {
  const languages = {
    code: 'jsx',
    usage: 'jsx',
    tailwind: 'jsx',
    installation: 'bash',
    css: 'css'
  };
  return languages[key];
};

export const decodeLabel = label =>
  label
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const forceChakraDarkTheme = () => {
  localStorage.setItem('chakra-ui-color-mode', 'dark');
};

export const slug = str => str.replace(/\s+/g, '-').toLowerCase();

export const toPascal = str =>
  str
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
