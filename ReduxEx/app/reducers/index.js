/**
 * Created by Administrator on 2016/8/30.
 */
import  {combineReducers} from 'redux';

import apiReducer from './apiReducer';

export default combineReducers({
    apiStore: apiReducer,
});