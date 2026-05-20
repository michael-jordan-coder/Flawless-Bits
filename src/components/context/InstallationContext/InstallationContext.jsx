import { createContext, useCallback, useEffect, useState } from 'react';

const InstallationContext = createContext(null);

export const InstallationProvider = ({ children }) => {
  const [installMode, setInstallMode] = useState(() => localStorage.getItem('cb_install_mode') || 'manual');
  const [cliTool, setCliTool] = useState(() => localStorage.getItem('cb_cli_tool') || 'shadcn');
  const [packageManager, setPackageManager] = useState(() => localStorage.getItem('cb_pkg_manager') || 'npm');

  useEffect(() => {
    localStorage.setItem('cb_install_mode', installMode);
  }, [installMode]);
  useEffect(() => {
    localStorage.setItem('cb_cli_tool', cliTool);
  }, [cliTool]);
  useEffect(() => {
    localStorage.setItem('cb_pkg_manager', packageManager);
  }, [packageManager]);

  const value = {
    installMode,
    setInstallMode: useCallback(m => setInstallMode(m), []),
    cliTool,
    setCliTool: useCallback(t => setCliTool(t), []),
    packageManager,
    setPackageManager: useCallback(p => setPackageManager(p), [])
  };

  return <InstallationContext.Provider value={value}>{children}</InstallationContext.Provider>;
};

export { InstallationContext };
