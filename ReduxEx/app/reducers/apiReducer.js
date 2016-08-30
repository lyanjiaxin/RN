/**
 * Created by Administrator on 2016/8/30.
 */
import * as types from '../actions/types';
import {ListView} from 'react-native';


//初始化 state
const initialState = {
    status: types.GET_GANK_DATA.INIT,
    dataArray: [],
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2,}),
    isRefreshing: false,
    isLoadMore: true,
    loadType: 0,
}

/**
 *  reduce 接收action传入的type 更改对应的state
 * @param state
 * @param action
 * @returns {*}
 */
export default function getData(state = initialState, action) {
    switch (action.type) {
        case types.GET_GANK_DATA.INIT:
            return {
                ...state,
                status: action.type,
                loadType: 0,
                isRefreshing: false,
            }
        case types.GET_GANK_DATA.START:
            return {
                ...state,
                status: action.type,
                loadType: action.loadType,
            }
        case types.GET_GANK_DATA.SUC:
            let newContent = action.loadType === 2 ? [...state.dataArray, ...action.data.results] : action.data.results;
            let isLoadMore = action.data.results.length === 10;
            return {
                ...state,
                dataArray: newContent,
                dataSource: state.dataSource.cloneWithRows(newContent),
                status: action.type,
                loadType: action.loadType,
                isRefreshing: false,
                isLoadMore: isLoadMore,
            }
        case types.GET_GANK_DATA.FAIL:
            return {
                ...state,
                status: action.type,
                loadType: action.loadType,
                isRefreshing: false,
            }
        default:
            return state;
    }
}