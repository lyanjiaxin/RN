/**
 * Created by Administrator on 2016/8/30.
 */
import * as types from './types';

const PAGE_NUM = 10;

/**
 *
 * @param type  指定特定动作的类型（action 对应的type）
 * @param loadType  加载数据的类型（0 初始化加载数据，1 下拉刷新，2 加载更多）
 * @param category  分类名称（如：Android、iOS、福利...）
 * @param pageNo 当前加载的页码
 */
function getListData(loadType, category, pageNo) {

    return (dispatch)=> {
        dispatch({type: types.GET_GANK_DATA.START, loadType: loadType}); //分发消息，要初始化数据
        let reqUrl = `http://gank.io/api/data/${category}/${PAGE_NUM}/${pageNo}`;

        return fetch(reqUrl)
            .then((response)=>response.json())
            .then((responseData)=>dispatch({type: types.GET_GANK_DATA.SUC,loadType: loadType, data: responseData}), //分发成功和失败的消息
                dispatch({type: types.GET_GANK_DATA.FAIL}));

    }

}

export  function fetchData(loadType, category, pageNo){
    return getListData(loadType, category, pageNo);
}