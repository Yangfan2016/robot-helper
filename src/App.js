import React, { Component } from 'react';
import {
	Icon,
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
			<div className="list-news">
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
			fallbackTxt: "",
			page: {
				defaultSize: 5
			},
			isLoading: false,
			isSpeaking: false
		};
	}
	changeTalkStatus(isPlay) {
		this.setState({
			isSpeaking: isPlay
		});
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
			isLoading: true
		});
		api.getInfoOfRobot(e.target.value, function ({ url, info, text }) {
			that.setState({
				isLoading: false,
				source: url,
				fallbackTxt: text,
				newsInfo: info || [],
				newsInfoOfPerPage: (info || []).slice(0, that.state.page.defaultSize)
			}, function () {
			});
		});
	}
	render() {
		return (
			<div className="app">
				<Input className="speck-inp" size="large"
					placeholder="请输入对话内容"
					onPressEnter={this.getResOfTurlingRobotApi.bind(this)} />
				<audio id="audio" autoPlay
					src={this.state.source}
					onPlay={this.changeTalkStatus.bind(this, true)}
					onPause={this.changeTalkStatus.bind(this, false)}></audio>
				<Spin spinning={this.state.isLoading}>
					<div className="listbox" style={{
						"display": this.state.newsInfo.length > 0 ? "block" : "none"
					}}>
						<News info={this.state.newsInfoOfPerPage} />
						<div style={{
							textAlign: "center"
						}}>
							<Pagination
								defaultPageSize={this.state.page.defaultSize}
								total={this.state.newsInfo ? this.state.newsInfo.length : 0}
								onChange={this.changePageOfNewsInfo.bind(this)} />
						</div>
					</div>
				</Spin>
				<div className="microphonebox">
					<p className={{
						"micro-text":true,
						"animat-text": this.state.isSpeaking
					}}>{this.state.fallbackTxt}</p>
					<Icon type="customer-service" className={{
						"icon-microphone": true,
						"animate-border": this.state.isSpeaking
					}} />
				</div>
			</div>
		);
	}
}

export default App;
