<template>
	<view>

		<view class="loadMoreGif" v-if="show">
			<image src="/static/images/loadding.gif"></image>
			<text>{{message}}</text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},

		mixins: [],
		components: {},
		props: {
			show: {
				type: Boolean,
				default: false
			},
			message: {
				default: "拼命加载中"
			}
		},
		methods: {},
		computed: {},
		watch: {}
	};
</script>
<style lang="less">
	.loadMoreGif {
		padding: 20rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #fff;
		box-sizing: border-box;

		text {
			font-size: 30rpx;
			color: #999;
			margin-left: 10rpx;
		}

		image {
			width: 60rpx;
			height: 60rpx;
		}
	}
</style>
