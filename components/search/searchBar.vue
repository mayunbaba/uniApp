<template>

	<view class="go-search">
		<navigator url="/pages/search" hover-class="none">
			<view class="search-con ellipsis">
				<image class="img" src="@/static/images/search-pic.png"></image>
				<text class="text">{{searchmessage}}</text>
			</view>
		</navigator>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				searchmessage: "搜菜谱、食材" // 搜索展示文案
			};
		},
		mixins: [],
		components: {},
		props: {},
		methods: {},
		computed: {},
		watch: {}
	};
</script>
<style lang="less">
	.go-search {
		position: fixed;
		top: 0;
		width: 100%;
		height: 88rpx;
		background: #1b1b1f;
		z-index: 9999;
		padding-top: 18rpx;

		navigator {
			width: 100%;
			height: 100%;
		}

		.text {
			display: inline-block;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			font-size: 30rpx;
			color: #999999;
		}

		.search-con {
			display: block;
			width: 670rpx;
			height: 70rpx;
			line-height: 70rpx;
			margin: 0 auto;
			text-align: center;
			background: #fff;
			border-radius: 12rpx;

			.img {
				display: inline-block;
				width: 26rpx;
				height: 26rpx;
				margin-right: 12rpx;
				vertical-align: middle;
				margin-top: -5rpx;

			}
		}
	}
</style>
