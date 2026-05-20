const getStarted = {
  introduction: () => import('../docs/Introduction.jsx'),
  installation: () => import('../docs/Installation.jsx'),
  mcp: () => import('../docs/McpServer.jsx')
};

const components = {
  'fill-button': () => import('../demo/Components/FillButtonDemo')
};

export const componentMap = {
  ...getStarted,
  ...components
};
