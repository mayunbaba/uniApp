<template>
	<view class="tabs-wrap" >
		<view class="tabs" >
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "Tabs",
	};
</script>

<style lang="less" scoped>
	.tabs-wrap {
		position: relative;

		.tabs {
			width: 100%;
			height: 88rpx;
			display: flex;
			background-color: #FFFFFF;
			border-bottom:1rpx solid #eee;
		}
	}
</style>
