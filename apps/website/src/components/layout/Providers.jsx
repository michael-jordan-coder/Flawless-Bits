import { Toaster } from 'sonner';
import { SearchProvider } from '../context/SearchContext/SearchContext';
import { OptionsProvider } from '../context/OptionsContext/OptionsContext';
import { TransitionProvider } from '../context/TransitionContext/TransitionContext';
import { InstallationProvider } from '../context/InstallationContext/InstallationContext';
import { toastStyles } from '../../utils/customTheme';

export default function Providers({ children }) {
  return (
    <SearchProvider>
      <OptionsProvider>
        <TransitionProvider>
          <InstallationProvider>
            {children}
            <Toaster toastOptions={toastStyles} position="bottom-right" visibleToasts={2} />
          </InstallationProvider>
        </TransitionProvider>
      </OptionsProvider>
    </SearchProvider>
  );
}
