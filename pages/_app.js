import React from 'react';
import App from 'next/app';
import { PersistGate } from 'redux-persist/integration/react';
import Head from 'next/head';
import _ from 'lodash';
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import '../styles/main.css';
import { initStore, getRrfProps } from '../store';


class MyApp extends App {

  constructor(props) {
    super(props);
    this.state = {
      store: false,
      rrfProps: {},
      persistor: null,
    }
  }

  componentDidMount() {
    const { store, persistor } = initStore();
    const rrfPrps = getRrfProps(store);
    this.setState({ store, rrfPrps, persistor });
  }

  render() {
    const { Component, pageProps } = this.props;
    if (!this.state.store || !process.browser) {
      return null;
    }
    return (
      <Provider store={this.state.store}>
        <ReactReduxFirebaseProvider {...this.state.rrfPrps}>
          <PersistGate loading={null} persistor={this.state.persistor}>
            <Head>
              <title>My game</title>
            </Head>
            <Component {...pageProps} />
          </PersistGate>
        </ReactReduxFirebaseProvider>
      </Provider>
    );
  }
}

export default MyApp;


    // const firebaseApp = firebase.initializeApp(firebaseConfig);
    // const base = Rebase.createClass(firebaseApp.database());
    // const { dispatch } = store;
    // let ref = firebase.database().ref('/');
    // ref.on('value', snapshot => {
    //   const user = snapshot.val();
    //   console.log('user', user);
    // });

    // base.fetch('game', {
    //   context: this,
    //   asArray: false,
    // }).then(data => {

    // }).catch(error => {
    //   console.error(error);
    // });

    // base.listenTo('game', {
    //   context: this,
    //   asArray: false,
    //   then(res) {
    //     dispatch(addPlayer(res.users));
    //   }
    // });