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

const capitalizeWords = str => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1));

export const decodeLabel = label => capitalizeWords(label).join(' ');

export const forceChakraDarkTheme = () => {
  localStorage.setItem('chakra-ui-color-mode', 'dark');
};

export const slug = str => str.replace(/\s+/g, '-').toLowerCase();

export const toPascal = str => capitalizeWords(str).join('');
