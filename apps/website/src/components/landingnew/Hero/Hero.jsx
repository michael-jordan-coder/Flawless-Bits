import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';
import Logo from '../../common/Logo';
import { GoogleSignIn } from '../../common/GoogleSignIn';

const BROWSE_TARGET = '/components/fill-button';

const Hero = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="cb-hero">
      <Logo size={56} strokeWidth={0.9} dotRadius={1} className="cb-hero-logo" />
      <h1 className="cb-hero-headline">
        Components for
        <br />
        the community
      </h1>
      <p className="cb-hero-description">
        A growing collection of animated, interactive React components, shared openly so anyone can drop them into their
        project.
      </p>
      <div className="cb-hero-buttons">
        <Link to="/components/index" className="cb-hero-btn cb-hero-btn-primary">
          Get started <FaArrowRight size={12} />
        </Link>
        {!showSignIn && (
          <button type="button" className="cb-hero-btn" onClick={() => setShowSignIn(true)}>
            Browse components
          </button>
        )}
      </div>
      {showSignIn && (
        <div className="cb-hero-signin">
          <p className="cb-hero-signin-label">Sign in with Google to browse</p>
          <GoogleSignIn onSignIn={() => navigate(BROWSE_TARGET)} />
        </div>
      )}
    </section>
  );
};

export default Hero;
