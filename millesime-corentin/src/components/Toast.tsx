import { useState } from 'react';
import { site } from '../content/site';

export function Toast() {
  const { toast } = site;
  const [raised, setRaised] = useState(false);
  return (
    <section id="toast" className="section toast" aria-labelledby="toast-title">
      <h2 id="toast-title">{toast.title}</h2>
      <p className="toast__lines">
        {toast.lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>
      {!raised ? (
        <button type="button" className="btn toast__btn" onClick={() => setRaised(true)}>
          {toast.button}
        </button>
      ) : null}
      <p className="toast__final" aria-live="polite">
        {raised && (
          <>
            <span className="toast__question">{toast.question}</span>
            <span className="toast__answer">{toast.answer}</span>
          </>
        )}
      </p>
      {raised && (
        <div className="bubbles" aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => (
            <span key={i} style={{ ['--i' as string]: i }} />
          ))}
        </div>
      )}
    </section>
  );
}
