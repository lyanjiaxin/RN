/**
 * Created by Administrator on 2016/8/30.
 */
import React,{Component} from 'react';
import {
    ListView,
    Text,
    Image,
    View,
    RefreshControl,
    StyleSheet,
    ToastAndroid,
    ProgressBarAndroid as ProgressBar,
} from 'react-native';

import * as types from '../actions/types';
import {connect} from 'react-redux';
import {fetchData} from '../actions/apiAction';
import CommonTouchableComp from '../comps/CommonTouchableComp';

class mainPage extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.category = this.props.category;
        this.tagName = this.props.tagName;
        this.curPageNo = 1;
        this.isLoadMoreing = false;
        this.onRetry = this._onRetry.bind(this);
    }


    componentDidMount() {
        this._fetchData(0);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.tagName !== nextProps.ext) {
            return false;
        }

        if (nextProps.status === types.GET_GANK_DATA.INIT) {
            return false;
        } else if (nextProps.status === types.GET_GANK_DATA.FAIL) {
            if (nextProps.loadType === 1) {
                ToastAndroid.show('刷新数据失败了...', ToastAndroid.SHORT);
                return false;
            } else if (nextProps.loadType === 2) {
                ToastAndroid.show('加载更多数据失败了....', ToastAndroid.SHORT);
                this.curPageNo
                this.isLoadMoreing = false;
                return false;
            }
        }
        return true;
    }

    componentDidUpdate(preProps, preState) {
        if (preProps.loadType === 2) {
            this.isLoadMoreing = false;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.props.dataSource}
                    renderRow={this._renderItem.bind(this)}
                    automaticallyAdjustContentInsets={false}//ios的属性
                    onEndReachedThreshold={5}
                    onEndReached={this.props.isLoadMore ? this._onLoadMore.bind(this) : null}
                    renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
                    renderFooter={this.props.isLoadMore ? this._footerView : null}
                    refreshControl={
                      <RefreshControl
                         refreshing={this.props.isRefreshing}
                         onRefresh={this._onRefresh.bind(this)}
                         tintColor='#AAAAAA'
                         title='下拉刷新'
                         progressBackgroundColor='#FFFFFF'/>}/>
            </View>
        );
    }

    _fetchData(loadType) {
        this.curPageNo = loadType !== 2 ? 1 : (this.curPageNo + 1);
        this.props.dispatch(fetchData(loadType, '前端', this.curPageNo));
    }

    _onRetry() {
        this.props.dispatch({type: types.GET_GANK_DATA.INIT});
        setTimeout(()=> {
            this._fetchData(0);
        },2000);
    }

    _onRefresh() {
        this._fetchData(1);
    }

    _onLoadMore() {
        if (this.isLoadMoreing) {
            return;
        }

        this.isLoadMoreing = true;

        setTimeout(()=> {
            this._fetchData(2);
        }, 1000);
    }

    _footerView() {
        return (
            <View style={styles.footerContainer}>
                <ProgressBar styleAttr="Small"/>
                <Text>
                    正在加载中...
                </Text>
            </View>
        );
    }

    _renderItem(gankData) {
        return (
            <CommonTouchableComp >
                <View style={styles.itemViewContainer}>
                    <Text style={styles.title} numberOfLines={2}>{gankData.desc}</Text>
                    <View style={styles.line2ItemViewContainer}>
                        <Text
                            style={styles.author}>{typeof gankData.who !== 'undefined' && gankData.who !== null ? 'via：' + gankData.who : ''}</Text>
                        <Text style={styles.time}>{this._formatTime(gankData.publishedAt)}</Text>
                    </View>
                </View>
            </CommonTouchableComp>
        );
    }

    _formatTime(time) {
        let date = new Date(time);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5FCFF",
    },
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
    },
    itemViewContainer: {
        padding: 10,
    },
    line2ItemViewContainer: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 16,
        marginBottom: 8,
        color: '#000000',
    },
    author: {
        flex: 1,
        fontSize: 14,
        color: '#999999',
    },
    time: {
        fontSize: 14,
        color: '#999999',
        textAlign: 'right',
    },
    separator: {
        height: 1,
        backgroundColor: '#cccccc',
    },
});
function select(store) {
    return {
        status: store.apiStore.status,
        dataSource: store.apiStore.dataSource,
        isRefreshing: store.apiStore.isRefreshing,
        loadType: store.apiStore.loadType,
        isLoadMore: store.apiStore.isLoadMore,
    }
}

export default connect(select)(mainPage);
