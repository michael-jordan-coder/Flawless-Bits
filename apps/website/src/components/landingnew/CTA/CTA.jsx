import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const LOOPS_FORM_ID = import.meta.env.VITE_LOOPS_FORM_ID;
const LOOPS_ENDPOINT = LOOPS_FORM_ID
  ? `https://app.loops.so/api/newsletter-form/${LOOPS_FORM_ID}`
  : null;

const CTA = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!LOOPS_ENDPOINT) {
      setStatus('error');
      setError('Newsletter is not configured yet.');
      return;
    }
    setStatus('loading');
    setError('');

    try {
      const body = new URLSearchParams({ email, userGroup: '', mailingLists: '' });
      const res = await fetch(LOOPS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Something went wrong. Try again.');
      }
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Something went wrong. Try again.');
    }
  };

  return (
    <section id="cta" className="cb-cta">
      <div className="cb-cta-inner">
        <h2 className="cb-cta-headline">Get notified when pro components land.</h2>
        <p className="cb-cta-sub">
          Cinematic 3D and scroll-driven pieces shipping later this year. One email when they do — no
          other reason to write.
        </p>

        {status === 'success' ? (
          <p className="cb-cta-confirm" role="status">
            You're in. We'll write when there's something worth showing.
          </p>
        ) : (
          <form className="cb-cta-form" onSubmit={handleSubmit} noValidate>
            <label className="cb-cta-field">
              <span className="cb-cta-visually-hidden">Email address</span>
              <input
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="you@studio.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={status === 'loading'}
                aria-invalid={status === 'error'}
                aria-describedby={status === 'error' ? 'cta-error' : undefined}
              />
            </label>
            <button
              type="submit"
              className="cb-cta-submit"
              disabled={status === 'loading' || !email}
            >
              <span>{status === 'loading' ? 'Adding…' : 'Notify me'}</span>
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            </button>
          </form>
        )}

        {status === 'error' && (
          <p id="cta-error" className="cb-cta-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  );
};

export default CTA;
