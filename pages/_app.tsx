import type { AppProps } from 'next/app';
import '../styles/globals.css';
import '@tremor/react/dist/esm/tremor.css';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp;
