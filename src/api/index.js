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
        return `http://tsn.baidu.com/text2audio?tex=${txt}&tok=24.b522c866f6df1788d70374b2ab008e45.2592000.1531194904.282335-11376852&cuid=1994-2018-0610&ctp=1&lan=zh&spd=5&pit=5&vol=5&per=0`;
    },
    getInfoOfRobot(str, cb) {
        let that = this;

        if (this.interceptContent(str, function (res) {
            cb && cb({
                url:that.getVoiceSrcOfBaidu(res.text)
            });
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
                cb && cb({
                    url:that.getVoiceSrcOfBaidu(res.text),
                    info:res.list
                });
            }
        });
    }
}