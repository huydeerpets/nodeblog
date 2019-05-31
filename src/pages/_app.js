import React from 'react';
import App, { Container } from 'next/app';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import { createStore, compose, applyMiddleware } from 'redux';
import withReduxSaga from 'next-redux-saga';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import Helmet from 'react-helmet';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import reducer from '../reducers/index';
import rootSaga from '../sagas';

const NodeBlog = ({ Component, store, pageProps }) => (
    <Container>
        <Provider store={store}>
            <Helmet
                title="NodeBlog"
                htmlAttributes={{ lang: 'ko' }}
                meta={[
                    { charset: 'UTF-8' },
                    {
                        name: 'viewport',
                        content:
                            'width=device-width,minimum-scale=1,initial-scale=1',
                    },
                    { 'http-equiv': 'X-UA-Compatible', content: 'IE-edge' },
                    { name: 'description', content: 'NodeBlog' },
                    { name: 'og:title', content: 'NodeBlog' },
                    { name: 'og:description', content: 'NodeBlog' },
                    { property: 'og:type', content: 'website' },
                ]}
                link={[
                    {
                        rel: 'stylesheet',
                        href:
                            'https://cdnjs.cloudflare.com/ajax/libs/antd/3.18.2/antd.css',
                    },
                    {
                        rel: 'stylesheet',
                        href:
                            'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css',
                        type: 'text/css',
                        charset: 'UTF-8',
                    },
                    {
                        rel: 'stylesheet',
                        href:
                            'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css',
                        type: 'text/css',
                        charset: 'UTF-8',
                    },
                ]}
                script={[
                    {
                        src:
                            'https://cdnjs.cloudflare.com/ajax/libs/antd/3.18.2/antd.js',
                    },
                ]}
            />
            <AppLayout>
                <Component {...pageProps} />
            </AppLayout>
        </Provider>
    </Container>
);

NodeBlog.getInitialProps = async context => {
    const { ctx, Component } = context;
    let pageProps = {};

    const state = ctx.store.getState();
    const cookie = ctx.isServer ? ctx.req.headers.cookie : '';

    // console.log(cookie);
    // HTTP 요청시 쿠키 추가
    if (ctx.isServer && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }
    // if (!state.user.me) {
    //     ctx.store.dispatch({
    //         type: LOAD_USER_REQUEST,
    //     });
    // }

    if (Component.getInitialProps) {
        pageProps = (await Component.getInitialProps(ctx)) || {};
    }

    return { pageProps };
};

NodeBlog.propTypes = {
    Component: PropTypes.elementType.isRequired,
    store: PropTypes.object.isRequired,
    pageProps: PropTypes.any.isRequired,
};

const loggingMiddleware = store => next => action => {
    // 액션확인
    // console.log(action);
    next(action);
};

const configureStore = (initialState, options) => {
    // customize a store.

    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware, loggingMiddleware];
    const enhancers =
        process.env.NODE_ENV === 'production'
            ? compose(applyMiddleware(...middlewares))
            : compose(
                  applyMiddleware(...middlewares),
                  !options.isServer &&
                      window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
                      ? window.__REDUX_DEVTOOLS_EXTENSION__()
                      : f => f,
              );

    const store = createStore(reducer, initialState, enhancers);

    // next-redux-saga
    store.sagaTask = sagaMiddleware.run(rootSaga);

    return store;
};

export default withRedux(configureStore)(withReduxSaga(NodeBlog));