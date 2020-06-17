<template>
	<view>

		<view class="xh-text" v-if="show">
			<text class="line"></text>
			<text class="text">{{message}}</text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},

		props: {
			show: {
				type: Boolean,
				default: false
			},
			message: {
				default: "学名厨做菜，用香哈"
			}
		},
	};
</script>
<style lang="less">
	.xh-text {
		width: 40%;
		margin: 38rpx auto;
		text-align: center;
		color: #cccccc;
		font-size: 24rpx;
		position: relative;

		.line {
			width: 100%;
			height: 2rpx;
			background: #cccccc;
			position: absolute;
			left: 0;
			top: 50%;
			-webkit-transform: translateY(-50%);
			transform: translateY(-50%);
		}

		.text {
			position: relative;
			top: 0;
			background: #fff;
			padding: 0 8rpx;
		}
	}
</style>
