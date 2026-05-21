import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';

const DocsButtonBar = ({ previous = null, next = null }) => (
  <div className="docs-button-bar">
    {previous && (
      <Link to={previous.route} className="docs-button">
        <FaArrowLeft />
        <span>{previous.label}</span>
      </Link>
    )}
    {next && (
      <Link to={next.route} className="docs-button docs-button-secondary">
        <span>{next.label}</span>
        <FaArrowRight />
      </Link>
    )}
  </div>
);

export default DocsButtonBar;
