<template>
	<view class="pox">
		<!--miniprogram/custom-tab-bar/index.wxml-->
		<cover-view class="tab-bar">
			<cover-view class="tab-bar-border"></cover-view>
			<cover-view v-for="(item,index) in list" :key="index" class="tab-bar-item" :data-path="item.pagePath" :data-index="index"
			 @click="switchTab">
				<cover-image :src="selected === index ? item.selectedIconPath : item.iconPath"></cover-image>
				<cover-view :style="{color: selected === index ? selectedColor : color}">{{item.text}}</cover-view>
			</cover-view>
		</cover-view>

	</view>
</template>

<script>
	export default {
		name: "custom-tab-bar",
		data() {
			return {
				selected: 0,
				color: "#7A7E83",
				selectedColor: "#3cc51f",
				list: [{
						"pagePath": "pages/home",
						"text": "首1页",
						"iconPath": "static/images/home-icon.png",
						"selectedIconPath": "static/images/home-active-icon.png"
					},
					{
						"pagePath": "pages/classify",
						"text": "分类",
						"iconPath": "static/images/classify-icon.png",
						"selectedIconPath": "static/images/classify-active-icon.png"
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
			switchTab(e) {
				console.log(e);
				// const data = e.currentTarget.dataset
				// const url = data.path
				// wx.switchTab({
				// 	url
				// })
				// this.setData({
				// 	selected: data.index
				// })
			}
		}
	}
</script>
<style>
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

	.tab-bar-item cover-image {
		width: 27px;
		height: 27px;
	}

	.tab-bar-item cover-view {
		font-size: 10px;
	}
</style>
