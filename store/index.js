import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { firebaseReducer, getFirebase } from 'react-redux-firebase';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createFirestoreInstance, firestoreReducer, reduxFirestore } from 'redux-firestore';
import { initFirebase } from '../db';
import reducer from './reducer';


const firebase = initFirebase();

const persistConfig = {
  key: 'reducer',
  storage,
};




const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

const rootReducer = combineReducers({
  reducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer // <- needed if using firestore
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const initialState = {};
export const initStore = (initialState = initialState) => {
  const middlewares = [
    thunk.withExtraArgument(getFirebase)

  ];
  const store = createStore(persistedReducer,
    composeWithDevTools(
      reduxFirestore(firebase, {}),
      applyMiddleware(...middlewares),
    ))
  return {
    store,
    persistor: persistStore(store),
  };
};

export const getRrfProps = (store) => {
  return {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance // <- needed if using firestore
  }
}




// import { createStore, applyMiddleware, compose } from 'redux';
// import logger from 'redux-logger';
// import { composeWithDevTools } from 'redux-devtools-extension';
// import thunk from 'redux-thunk';
// import { reduxFirestore, getFirestore } from 'redux-firestore';
// import { getFirebase, reactReduxFirebase } from 'react-redux-firebase';
// import reducer from './reducer';
// import { initFirebase, fbConfig } from '../db';

// const firebase = initFirebase();

// export const initialState = {
//   players: [],
// };

// export const initStore = (initialState = initialState) => {
//   const store = createStore(reducer,
//     compose(
//       applyMiddleware(thunk.withExtraArgument({ getFirestore, getFirebase })),
//       reduxFirestore(firebase),
//       reactReduxFirebase(fbConfig),
//     ))
//   return store;
// };


// createStore(reducer, initialState, composeWithDevTools(
//   applyMiddleware(thunk.withExtraArgument({ getFirestore, getFirebase })),
//   reduxFirestore(firebase),
//   reactReduxFirebase(fbConfig),
//   ))