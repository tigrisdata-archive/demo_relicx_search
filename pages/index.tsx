import Head from 'next/head';
import Search from '../components/Search';

const Home = () => {
  return (
    <div>
      <Head>
        <title>Search</title>
        <meta name='description' content='' />
      </Head>
      <Search></Search>
    </div>
  );
};

export default Home;
