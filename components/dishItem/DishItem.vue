<template>
	<div class="video-wrap" @click="goDetail(item.type,item.code)" :style="{width:imgWid+'px'}">
		<view :style="{width:imgWid+'px',height:imgWid*item.image.height/item.image.width+'px',backgroundImage:'url('+item.image.url+')'}"
		 class="cover">
		 <!-- #ifndef MP-ALIPAY -->
		 <image src="/static/images/bf.png" mode="aspectFit" class="icon" v-if="item.type == 7 || item.type == 2"></image>
		 <!-- #endif -->
		</view>
		<view class="bottom">
			<view class="title">{{item.title}}</view>
			<view class="col-2">
				<view class="name-wrap">
					<image :src="item.customer.img" class="avater"></image>
					<view class="text name">{{item.customer.nickName}}</view>
				</view>
				<view class="name-wrap" v-if="item.allClick">
					<image src="/static/images/eye.png" class="eye"></image>
					<view class="text-click">{{item.allClick}}</view>
				</view>
				<view class="name-wrap" v-if="item.favTime">
					<view class="text-click">{{item.favTime}}</view>
				</view>
			</view>
		</view>
	</div>
</template>

<script>
	import utils from "@/utils/util";
	export default {
		name: "DishItem",
		props: {
			item: {
				type: Object
			},
			imgWid: {
				type: Number
			}
		},
		methods: {
			// 跳转到对应的详情页
			goDetail(type, code) {
				var url = '';
				if (type == 7) {
					url = '/pages/videoDetail?dishCode=' + code;
				} else if (type == 4) {
					url = '/pages/menuDetail?code=' + code;
				} else {
					url = '/pages/recipeDetail?dishCode=' + code;
				}
				utils.xhNavigateTo(url);
			},
		}
	};
</script>

<style lang="less">
	.video-wrap {
		width: 100%;
		border-radius: 8rpx;
		overflow: hidden;
		position: relative;
		margin-bottom: 20rpx;
		box-shadow: 0rpx 0rpx 10rpx rgb(230, 230, 230);

		.cover {
			background-size: cover;
			background-position: center center;
			background-repeat: no-repeat;
		}

		.icon {
			width: 35rpx;
			height: 35rpx;
			position: absolute;
			top: 14.5rpx;
			right: 14.5rpx;
		}

		.title {
			font-size: 26rpx;
			color: #333333;
			line-height: 38rpx;
			margin-bottom: 16rpx;
			font-weight: bold;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		.bottom {
			padding: 10rpx 15rpx 20rpx;
			background: #ffffff;

			.col-2 {
				display: flex;
				justify-content: space-between;
			}


			.name-wrap {
				display: flex;
				align-items: center;

				.avater {
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
				}

				.eye {
					width: 36rpx;
					height: 25rpx;
				}

				.text {
					margin-left: 10rpx;
					font-size: 22rpx;
					color: #333333;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;

					&.name {
						width: 110rpx;
					}
				}

				.text-click {
					margin-left: 4rpx;
					font-size: 22rpx;
					color: #777777;
				}
			}
		}
	}
</style>
