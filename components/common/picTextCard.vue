<template>
	<view @click="nav" class="item-one clearfix">
		<view class="con-l type_green" :style="'background:url(' + item.img + ');background-size:100%;border-radius:6rpx;'">
			<view class="bf-btn ps-right-bottom" v-if="item.time">
				<view class="bf-time-con">
					<image src="/static/images/play-arrow.png"></image>
					{{item.time}}
				</view>
			</view>
		</view>
		<view class="con-r">
			<text class="title">{{item.name}}</text>
			<view class="min-con">
				<text class="author">{{item.customer.nickName}}</text>
				<text class="see">{{item.allClick}}次观看</text>
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
	.item-one {
		margin: 36rpx 40rpx;
		display: flex;
		align-items: center;

		.con-l {
			position: relative;
			width: 404rpx;
			height: 222rpx;

			.bf-btn {
				display: inline-block;
				width: 100rpx;
				height: 34rpx;
				line-height: 34rpx;
				border-radius: 30rpx;
				background: rgba(0, 0, 0, 0.5);

				.bf-time-con {
					font-size: 20rpx;
					color: #fff;

					image {
						width: 10rpx;
						height: 16rpx;
						margin-left: 18rpx;
						margin-right: 5rpx;
					}
				}
			}

			.ps-right-bottom {
				position: absolute;
				right: 10rpx;
				bottom: 10rpx;
			}
		}

		.con-r {
			width: 374rpx;
			height: 196rpx;
			padding-left: 30rpx;
			font-size: 24rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.title {
				display: block;
				width: 100%;
				line-height: 44rpx;
				font-size: 34rpx;
				font-weight: 700;
				color: #333333;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				align-content: center;
			}

			.yongliao {
				width: 100%;
				height: 56rpx;
				line-height: 66rpx;
				color: #525252;
			}

			.min-sty-hui {
				font-size: 24rpx;
				color: #969696;
			}

			.time {
				margin-right: 20rpx;
			}

			.dish-count {
				display: block;
				margin-top: 30rpx;
			}

			.min-con {
				display: flex;
				flex-direction: column;
				font-size: 24rpx;

				.author {
					color: #999999;
					margin-bottom: 12rpx;
				}

				.see {
					color: #666666;
				}
			}
		}

	}
</style>
