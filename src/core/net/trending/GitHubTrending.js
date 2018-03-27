/**
 * 从https://github.com/trending获取数据
 * 项目地址:https://github.com/crazycodeboy/GitHubTrending
 * 博客地址:http://www.devio.org
 * @flow
 */
import TrendingUtil from './TrendingUtil';
import jsonp from 'jsonp';
import {NETWORK_TIMEOUT} from '../api';
import Api from '../api';

export default class GitHubTrending {
    GitHubTrending() {//Singleton pattern
        if (typeof GitHubTrending.instance === 'object') {
            return GitHubTrending.instance;
        }
        GitHubTrending.instance = this;
    }
    fetchTrending(url) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                resolve({
                    result: false,
                    status: NETWORK_TIMEOUT,
                    message: '超时'
                })
            }, 15000);
            fetch("/trend")
                    .then((response) => {
                        clearTimeout(timeoutId);
                        return response.text()
                    })
                    .catch((error) => {
                        clearTimeout(timeoutId);
                        reject({result: false, data: error});
                        console.log(error);
                    }).then((responseData) => {
                    try {
                        resolve({result: true, data: TrendingUtil.htmlToRepo(responseData)});
                    } catch (e) {
                        reject({result: false, data: e});
                    }
                });
            //}
        });
    }

    fetch(path, requestParams) {
        const stream = weex.requireModule('stream');
        return new Promise((resolve, reject) => {
            stream.fetch({
                method: 'GET',
                url: path,
                headers: {},
                type: "json",
                body: requestParams.body
            }, (response) => {
                if (response.status == 200) {
                    resolve(response)
                } else {
                    reject(response)
                }
            }, () => {
            })
        })

    }


}