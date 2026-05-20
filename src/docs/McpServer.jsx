import useScrollToTop from '../hooks/useScrollToTop';
import DocsButtonBar from './DocsButtonBar';

const McpServer = () => {
  useScrollToTop();

  return (
    <section className="docs-section">
      <h3 className="docs-category-title">MCP server</h3>

      <p className="docs-paragraph dim">
        Reserved for the upcoming Model Context Protocol server that will let agents fetch components by name.
      </p>
      <p className="docs-paragraph">
        Once shipped, this page will document the install command, the available tools, and an example wiring for
        Claude Code.
      </p>

      <DocsButtonBar previous={{ label: 'Installation', route: '/get-started/installation' }} />
    </section>
  );
};

export default McpServer;
