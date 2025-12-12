'use client';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <div className="card">
          <h1>Algo deu errado</h1>
          <p data-testid="error-message">{error.message || 'Erro interno inesperado.'}</p>
          <button onClick={reset} type="button">
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
