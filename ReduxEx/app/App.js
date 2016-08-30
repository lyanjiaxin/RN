/**
 * Created by Administrator on 2016/8/30.
 */
import React,{Component} from 'react';
import {
    Provider
} from 'react-redux';

import RootPage from './RootPage';
import configureStore from './store';

const store = configureStore();

/**
 * 在根页面通过Provider注入Store（可以理解为创建一个通话网络，想与之通信的都必须调用connect方法）
 */
export  default class App extends Component {


    render() {
        return (
            <Provider store={store}>
                <RootPage/>
            </Provider>
        );
    }

}