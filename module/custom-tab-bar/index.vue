<template>
	<view>
		<!--miniprogram/custom-tab-bar/index.wxml-->
		<view class="tab-bar">
			<view class="tab-bar-border"></view>
			<view v-for="(item,index) in list" :key="index" class="tab-bar-item" :data-path="item.pagePath" :data-index="index"
			 @click="switchTab(item.pagePath)">
				<image :src="path === item.pagePath ? item.selectedIconPath : item.iconPath"></image>
				<view :style="{color: path === item.pagePath ? selectedColor : textColor}">{{item.text}}</view>
			</view>
		</view>
		<view class="tab-bar-height"></view>
	</view>
</template>

<script>
	export default {
		name: "custom-tab-bar",
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
				console.log(path);
				uni.redirectTo({
					url: '/'+path
				});
			}
		},
		created() {
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
	.tab-bar-height{
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
	}

	.tab-bar-item image {
		width: 27px;
		height: 27px;
	}

	.tab-bar-item view {
		font-size: 10px;
	}
</style>
