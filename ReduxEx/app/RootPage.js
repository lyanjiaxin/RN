/**
 * Created by Administrator on 2016/8/30.
 */
import React,{Component} from 'react';
import {
    Navigator,
    View,
    StatusBar,
    BackAndroid,
    StyleSheet,
    ToastAndroid
} from 'react-native';

import mainPage from './pages/mainPage';

class RootPage extends Component {

    static childContextTypes = {
        addBackButtonListener: React.PropTypes.func,
        removeBackButtonListener: React.PropTypes.func,
    };

    // 构造
    constructor(props) {
        super(props);

        this.backButtonListeners = ([]
    :
        Array < ()
    =>
        boolean >
    )
        ;
        this.onBack = this._onBack.bind(this);
        this.addBackButtonListener = this._addBackButtonListener.bind(this);
        this.removeBackButtonListener = this._removeBackButtonListener.bind(this);
        this.handlerConfigureScene = this._handlerConfigureScene.bind(this);
    }

    getChildContext() {
        return {
            addBackButtonListener: this.addBackButtonListener,
            removeBackButtonListener: this.removeBackButtonListener,
        };
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.onBack);
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.onBack);
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent={true} backgroundColor={'rgba(0, 0, 0, 0.2)'}/>
                <Navigator
                    ref={component => this.navigator = component}
                    initialRoute={{name:'mainPage',component:mainPage}}
                    configureScene={this.handlerConfigureScene}
                    renderScene={this._renderScene.bind(this)}/>
            </View>
        );
    }

    _handlerConfigureScene() {
        return Navigator.SceneConfigs.FloatFromBottomAndroid;
    }

    _addBackButtonListener(listener) {
        this.backButtonListeners.push(listener);
    }

    _removeBackButtonListener(listener) {
        this.backButtonListeners = this.backButtonListeners.filter((handler) => handler !== listener);
    }

    _onBack() {
        // 判断是否有子组件需要消耗返回键事件
        for (let i = this.backButtonListeners.length - 1; i >= 0; i--) {
            if (this.backButtonListeners[i]()) return true;
        }

        let navigator = this.navigator;

        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop();
            return true;
        }

        let curTimestamp = new Date().getTime();

        // 判断3秒内两次按返回键才真正退出APP
        if (this.extTimestamp !== undefined && curTimestamp - this.extTimestamp <= 3000) {
            // 真正退出
            return false;
        } else {
            ToastAndroid.show('再按一次退出APP', ToastAndroid.SHORT);
            this.extTimestamp = curTimestamp;
            return true;
        }
    }

    _renderScene(route, navigator) {
        if (route && route.component) {
            var {component:Component, ...route} = route;
            return <Component navigator={navigator} {...route} />;
        }

        return <MainPage navigator={navigator} {...route} />;
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default RootPage;