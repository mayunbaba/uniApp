<template>
	<view>
		<!--miniprogram/custom-tab-bar/index.wxml-->
		<view class="tab-bar">
			<view class="tab-bar-border"></view>
			<view v-for="(item,index) in list" :key="index" class="tab-bar-item" :data-path="item.pagePath" :data-index="index"
			 @click="switchTab(item.pagePath)">
				<view v-show="msgNum != 0 && item.pagePath == 'pages/message'" class="dot">{{msgNum}}</view>
				<image :src="path === item.pagePath ? item.selectedIconPath : item.iconPath"></image>
				<view :style="{color: path === item.pagePath ? selectedColor : textColor}">{{item.text}}</view>
			</view>
		</view>
		<view class="tab-bar-height"></view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		name: "customTabBar",
		computed:{
			...mapState(['msgNum'])
		},
		data() {
			return {
				"path": "pages/home",
				"textColor": "#dddddd",
				"selectedColor": "#000000",
				"backgroundColor": "#ffffff",
				"list": [{
						"pagePath": "pages/home",
						"text": "首页",
						"iconPath": "/static/images/home-icon.png",
						"selectedIconPath": "/static/images/home-active-icon.png"
					},
					{
						"pagePath": "pages/classify",
						"text": "分类",
						"iconPath": "/static/images/classify-icon.png",
						"selectedIconPath": "/static/images/classify-active-icon.png"
					},
					{
						"pagePath": "pages/video",
						"text": "视频",
						"iconPath": "/static/images/comment.png",
						"selectedIconPath": "/static/images/comment-active.png"
					},
					// #ifdef MP-BAIDU
					{
						"pagePath": "pages/message",
						"text": "消息",
						"iconPath": "/static/images/comment.png",
						"selectedIconPath": "/static/images/comment-active.png"
					},
					// #endif
					{
						"pagePath": "pages/user",
						"text": "我的",
						"iconPath": "/static/images/user-icon.png",
						"selectedIconPath": "/static/images/user-active-icon.png"
					}
				]
			}
		},
		methods: {
			switchTab(path) {
				if ((path == 'pages/user' || path == 'pages/message') && !this.$store.state.userInfo.code) {
					uni.navigateTo({
						url: "/pages/login?path=" + path
					})
				} else {
					uni.switchTab({
						url: '/' + path
					})
				}
			}
		},
		created() {
			uni.hideTabBar();
			//该函数获取所有栈内的路由
			let pages = getCurrentPages();
			//数组中最后一个即当前路由，options是参数
			let {
				route
			} = pages.pop();
			this.path = route;
		}
	}
</script>
<style>
	.dot{
		padding:1px 6px;
		background-color: #f00;
		position: absolute;
		border-radius: 6px;
		color: #FFFFFF;
		top: 0;
		left: 50%;
		font-size: 10px;
	}
	.tab-bar-height {
		width: 100%;
		height: 48px;
		background-color: #FFFFFF;
	}

	.tab-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 48px;
		background: white;
		display: flex;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tab-bar-border {
		background-color: rgba(0, 0, 0, 0.33);
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 1px;
		transform: scaleY(0.5);
	}

	.tab-bar-item {
		flex: 1;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		position: relative;
	}

	.tab-bar-item image {
		width: 27px;
		height: 27px;
	}

	.tab-bar-item view {
		font-size: 10px;
	}
</style>
