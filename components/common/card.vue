<template>
	<view class="item-one">
		<view @click="navTo('/pages/recipeDetail?dishCode=' + item.code + '')">
			<view class="info">
				<view class="info-img-wrap">
					<image :src="item.img" class="info-img"></image>
					<!-- #ifndef MP-ALIPAY -->
					<image v-if="item.isVideo == 2" src="/static/images/bf-btn.png" class="bf-btn ps-center"></image>
					<!-- #endif -->
				</view>

				<text class="title ellipsis">{{item.title}}</text>
				<view class="info-profiles clearfix">
					<text>{{item.customer.nickName}}</text>
					<image src="/static/images/meishijia-icon.png" v-if="item.customer.isGourmet == 2"></image>
					<text class="ml-20">{{item.numInfo1}}</text>
					<text class="ml-20">{{item.numInfo2}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import utils from "@/utils/util";
	export default {
		name: "Card",
		props: {
			item: {
				type: Object
			},
		},
		methods: {
			// 页面跳转
			navTo(url) {
				utils.xhNavigateTo(url);
			},
		},
	};
</script>

<style lang="less" scoped>
	.item-one {
		width: 670rpx;
		padding-top: 30rpx;
		margin: 30rpx auto;
		border-top: 1rpx solid #e9e9e9;

		&:nth-child(1) {
			border-top: none;
			padding-top: 10rpx;
		}

		.info-img {
			display: block;
			position: relative;
			width: 100%;
			height: 402rpx;
			border-radius: 6rpx;
		}

		.info-img-wrap {
			position: relative;
		}

		.bf-btn {
			width: 96rpx;
			height: 96rpx;
		}

		.ps-center {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}

		.title {
			display: block;
			margin: 24rpx 0 8rpx;
			height: 50rpx;
			line-height: 50rpx;
			text-align: left;
			font-size: 36rpx;
			color: #444444;
			font-weight: 700;
		}

		.info-profiles {
			color: #b5b4b4;
			font-size: 24rpx;
			height: 24rpx;

			text,
			image {
				float: left;
				margin-left: 6rpx;
			}

			text:nth-of-type(2),
			text:nth-of-type(3) {
				margin-left: 20rpx;
			}

			image {
				width: 23rpx;
				height: 20rpx;
				margin-top: 8rpx;
			}
		}


	}

	.ellipsis {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
