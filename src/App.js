import React, { Component } from 'react';
import {
  Spin,
  Pagination,
  List,
  Avatar,
  Input
} from "antd";
import 'antd/dist/antd.css';
import "./css/App.css";
// import zhCN from "antd/lib/locale-provider/zh_CN";
// import moment from "moment";
// import "moment/locale/zh-cn";
// moment.locale("zh-cn");
import api from "./api/index.js";

class News extends Component {
  render() {
    return (
      <div>
        <List
          itemLayout="horizontal"
          dataSource={this.props.info}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.icon} />}
                title={<a href={item.detailurl} target="_blank">{item.article}</a>}
                description={`来源：${item.source}`}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      source: null,
      newsInfo: [],
      page: {
        defaultSize: 5
      },
      isLoading:false
    };
  }
  changePageOfNewsInfo(page, pageSize) {
    let index = (page - 1) * pageSize;
    this.setState({
      newsInfoOfPerPage: this.state.newsInfo.slice(index, index + pageSize)
    })
  }
  getResOfTurlingRobotApi(e) {
    let that = this;
    that.setState({
      isLoading:true
    });
    api.getInfoOfRobot(e.target.value, function ({ url, info }) {
      that.setState({
        isLoading:false,
        source: url,
        newsInfo: info || [],
        newsInfoOfPerPage: (info || []).slice(0, that.state.page.defaultSize)
      }, function () {
      });
    });
  }
  render() {
    return (
      <div className="app">
        <Spin spinning={this.state.isLoading}>
          <Input placeholder="请输入对话内容"
            onPressEnter={this.getResOfTurlingRobotApi.bind(this)} />
          <audio id="audio" controls src={this.state.source} autoPlay></audio>
          <div style={{
            "display": this.state.newsInfo.length > 0 ? "block" : "none"
          }}>
            <News info={this.state.newsInfoOfPerPage} />
            <Pagination
              defaultPageSize={this.state.page.defaultSize}
              total={this.state.newsInfo ? this.state.newsInfo.length : 0}
              onChange={this.changePageOfNewsInfo.bind(this)} />
          </div>
        </Spin>
      </div>
    );
  }
}

export default App;
