import Router from 'next/router';
import React, { useEffect } from 'react';

const Page = () => {
  useEffect(() => {
    Router.push('/');
  }, []);
  return null;
};
export default Page;