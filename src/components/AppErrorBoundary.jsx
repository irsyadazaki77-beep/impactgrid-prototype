import React from 'react';

export default class AppErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ImpactGrid render error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="app-error-state" role="alert" aria-live="assertive">
          <div className="app-error-card">
            <span className="app-error-kicker">Halaman tidak dapat ditampilkan</span>
            <h1>Terjadi kendala saat memuat ImpactGrid</h1>
            <p>Data simulasi dan fitur lain tetap aman. Muat ulang aplikasi untuk mencoba kembali.</p>
            {import.meta.env.DEV && <pre className="app-error-detail">{this.state.error?.message}</pre>}
            <button type="button" onClick={() => window.location.reload()}>Muat ulang aplikasi</button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
