import useScrollToTop from '../hooks/useScrollToTop';
import DocsButtonBar from './DocsButtonBar';

const Installation = () => {
  useScrollToTop();

  return (
    <section className="docs-section">
      <h3 className="docs-category-title">Installation</h3>

      <p className="docs-paragraph dim">
        There are two ways to bring a community-bits component into your project: the CLI or manual copy.
      </p>

      <h4 className="docs-category-subtitle">Via CLI</h4>
      <p className="docs-paragraph">
        Use the <span className="docs-highlight">jsrepo</span> or <span className="docs-highlight">shadcn</span> CLI to
        pull a specific component into your project. The exact command is shown on each component&apos;s page.
      </p>

      <h4 className="docs-category-subtitle">Manual</h4>
      <p className="docs-paragraph">
        Each component page exposes a <span className="docs-highlight">Code</span> tab with the four variant sources.
        Pick one, paste it into your project, and adjust the props.
      </p>

      <DocsButtonBar
        previous={{ label: 'Introduction', route: '/get-started/introduction' }}
        next={{ label: 'MCP server', route: '/get-started/mcp' }}
      />
    </section>
  );
};

export default Installation;
