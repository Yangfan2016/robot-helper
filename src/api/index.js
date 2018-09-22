import { Yan } from "yanjs";
export default {
    interceptContent(str, cb) {
        let search = (/搜索(.+)/g.exec(str) || [])[1];
        if (search && cb) {
            let winHandel=window.open(`https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=0&rsv_idx=1&tn=baidu&wd=${decodeURIComponent(search)}`);
            cb({
                code: 2018000,
                text: `亲，已为你搜索“${search}”`
            });
            console.log(winHandel.location);
        }
        return !!search;
    },
    getVoiceSrcOfBaidu(txt) {
        return 'http://tsn.baidu.com/text2audio?'+Yan.$params.serialize({
            'tex':txt,
            'tok':'24.9c9086d0096597de24687e5996b307c2.2592000.1540215439.282335-11376852', // a month expires
            'cuid':'1994-2018-0610',
            'ctp':1,
            'lan':'zh',
            'spd':5,
            'pit':5,
            'vol':5,
            'per':0,
        });        
    },
    getInfoOfRobot(str, cb) {
        let that = this;

        if (this.interceptContent(str, function (res) {
            cb && cb(Object.assign(res,{
                url:that.getVoiceSrcOfBaidu(res.text)
            }));
        })) return;

        Yan.$http({
            url: "http://www.tuling123.com/openapi/api",
            method: "get",
            headers: {
                "Content-Type": "audio/mp3"
            },
            data: {
                key: "84382f335ff54302adc7a970dff0c61c",
                info: str,
                loc: "北京市"
            },
            success: res => {
                cb && cb(Object.assign(res,{
                    url:that.getVoiceSrcOfBaidu(res.text),
                    info:res.list
                }));
            }
        });
    }
}