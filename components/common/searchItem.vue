<template>
	<view @click="nav" class="clearfix flex item-con-btn">
		<view class="con-l type_green">
			<image class="con-l type_green" :src="item.img"></image>
			<view v-if="item.isVideo==2" class="bf-btn ps-right-bottom">
				<view class="bf-time-con">
					<image src="/static/images/play-arrow.png"></image>
					{{item.videoTime}}
				</view>
			</view>
		</view>

		<view class="con-r">
			<view class="title ellipsis">
				<text class="h4 ellipsis">{{item.title}}</text>
				<text v-if="item.isFine==2" class="jing">精</text>
			</view>
			<text class="yongliao ellipsis">{{item.ingreMian}}</text>
			<text class="author min-sty-hui">{{item.nickName}}</text>
			<view class="min-con clearfix">
				<text class="see one">{{item.numInfo1}}</text>
				<text class="collection two">{{item.numInfo2}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "picTextCard",
		props: {
			item: {
				type: Object
			},
		},
		methods: {
			nav() {
				this.$emit('click');
			}
		},
	};
</script>

<style lang="less" scoped>
	.item-con-btn {
		margin: 36rpx 40rpx;
		display: flex;
		align-items: center;

		.con-l {
			position: relative;
			float: left;
			width: 332rpx;
			height: 222rpx;
			border-radius: 6rpx;
			background: url("https://s2.cdn.xiangha.com/images/m5/Common/echo2.jpg") no-repeat;
			background-size: 100% 100%;

			.bf-btn {
				width: 100rpx;
				height: 34rpx;
				line-height: 34rpx;
				border-radius: 30rpx;
				background: rgba(0, 0, 0, 0.5);
				position: absolute;
				right: 10rpx;
				bottom: 10rpx;

				.bf-time-con {
					font-size: 20rpx;
					color: #fff;

					image {
						width: 10rpx;
						height: 16rpx;
						margin-left: 18rpx;
						margin-right: 8rpx;
					}
				}
			}
		}

		.con-r {
			float: left;
			padding-left: 36rpx;
			box-sizing: border-box;
			width: 334rpx;
			font-size: 24rpx;

			.title {
				display: block;
				width: 100%;
				height: 56rpx;
				line-height: 56rpx;
				font-size: 36rpx;
				font-weight: 700;
				color: #444444;
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-wrap: nowrap;
				.h4 {
					width: 252rpx;
					height: 56rpx;
				}

				.jing {
					color: #f34646;
					border: 1px solid #f34646;
					width: 32rpx;
					height: 32rpx;
					line-height: 35rpx;
					font-size: 24rpx;
					margin-left: 10rpx;
					text-align: center;
					font-weight: 300;
				}
			}

			.yongliao {
				display: block;
				height: 56rpx;
				line-height: 66rpx;
				color: #525252;
			}

			.min-sty-hui {
				font-size: 24rpx;
				color: #969696;
			}

			.author {
				display: inline-block;
				height: 44rpx;
				line-height: 50rpx;
			}

			.time {
				margin-right: 20rpx;
			}

			.min-con {
				display: block;
				height: 50rpx;
				line-height: 50rpx;
				font-size: 24rpx;
				color: #525252;

				.collection {
					padding-left: 24rpx;
				}
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
