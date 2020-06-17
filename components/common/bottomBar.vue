<template>

	<form report-submit="false">
		<view class="fix-bot-box clearfix">
			<button :class="{'shouc-ac': item.isFavorites == 2,'item':true}" form-type="submit" @click="setLike">
				<image v-if="item.isFavorites == 2" class="icon" src="/static/images/new-bottom-bar-xin-active.png"></image>
				<image v-else class="icon" src="/static/images/new-bottom-bar-xin.png"></image>
				<view v-if="item.isFavorites == 2" class="text">已收藏</view>
				<view v-else class="text">收藏</view>
			</button>
			<button class="item item-but" form-type="submit" @click="goPage">
				<view class="text">查看更多菜谱 >></view>
			</button>
		</view>
		<view class="bot-box"></view>
	</form>

</template>

<script>
	export default {
		props: {
			item: {
				type: Object
			},
		},
		methods: {
			setLike() {
				this.$emit("setLike");
			},

			goPage() {
				this.$emit('goPage');
			},
		},
	};
</script>
<style lang="less">
	.bot-box{
		width: 100%;
		height: 96rpx;
	}
	.fix-bot-box {
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 96rpx;
		line-height: 96rpx;
		background: #fcfcfc;
		color: #ffffff;
		z-index: 1001;

		.item {
			flex: 1;
			display: inline-block;
			height: 96rpx;
			line-height: 96rpx;
			border-radius: 0;
			text-align: center;
			border: none;
			background: #fd9128;
			display: flex;
			align-items: center;
			justify-content: center;

			.icon {
				width: 41rpx;
				height: 35rpx;
				margin-right: 10rpx;

				&.icon-nav {
					margin-bottom: 6rpx;
				}
			}

			.text {
				font-size: 32rpx;
				color: #ffffff;
				display: inline-block;
			}

			&.shouc-ac {
				background: #f5f5f5;

				.text {
					color: #343434;
				}
			}

			&:nth-child(2) {
				background: #f23030;
			}
		}

		.item-but {
			position: relative;
			background: #d41a2e;
			height: 96rpx;
			line-height: 96rpx;
			border-radius: 0;
		}

		.item-but::after {
			border: 0 none;
		}

		.remind {
			image {
				position: absolute;
				top: -127rpx;
				left: 53%;
				width: 282rpx;
				height: 130rpx;
			}
		}
	}
</style>
