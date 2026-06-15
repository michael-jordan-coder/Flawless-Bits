import code from '@content/Components/OtpInput/OtpInput.jsx?raw';
import css from '@content/Components/OtpInput/OtpInput.css?raw';
import tailwind from '@tailwind/Components/OtpInput/OtpInput.jsx?raw';
import tsCode from '@ts-default/Components/OtpInput/OtpInput.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/OtpInput/OtpInput.tsx?raw';

export const otpInput = {
  dependencies: 'motion',
  usage: `import OtpInput from './OtpInput';

<OtpInput length={6} onComplete={code => console.log(code)} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
