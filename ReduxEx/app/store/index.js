/**
 * Created by Administrator on 2016/8/30.
 */
import {applyMiddleware,createStore} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

const logger = store => next => action => {

    if (typeof action === 'function') {
        console.log('>>>> logger => dispatching a function');
    } else {
        console.log('>>>> logger => dispatching', action);
    }

    let result = next(action);
    console.log('next state', store.getState());
    return result;
}
const createStoreWithMiddleware = applyMiddleware(logger, thunk)(createStore);

/**
 * 创建唯一的store树
 * @param initiaState
 * @returns {*}
 */
export default function configureStore(initiaState) {
    return createStoreWithMiddleware(reducers, initiaState);
}