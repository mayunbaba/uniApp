<template>
	<view class="center">
		<!-- #ifdef MP-BAIDU -->
		<view v-if="adList[adPos].apid" class="ad">
			<ad :appid="adList[adPos].appid" :apid="adList[adPos].apid" :type="adList[adPos].type" :class="{'big-cover':adList[adPos].type == 'feed'}"></ad>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-TOUTIAO -->
		<view v-if="adList[adPos].apid && showad">
			<ad 
			:type="adList[adPos].type" 
			scale="148"
			:class="{'li-tt':adList[adPos].type == 'lImg'}"
			@load="adloadhandler" 
			@error="aderrorhandler" 
			@close="adclosehandler" 
			:unit-id="adList[adPos].apid"
			v-if="showad"></ad>
		</view>
		<!-- #endif -->

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				data: {},
				showad:true,
			};
		},
		computed: {
			...mapState(['adList'])
		},
		props: {
			showAdBox: {
				type: Boolean,
				default: false
			},
			adPos: {
				type: String,
				default: ''
			},
			
		},
		methods:{
			adloadhandler(e) {
				console.log("广告加载成功");
			},
			aderrorhandler(e) {
				console.log("广告加载失败", e);
				// uni.showToast({
				// 	title: "广告加载失败" + e.errMsg,
				// 	icon: "fail",
				// });
			},
			adclosehandler(e) {
				console.log("广告关闭");
				this.showad = false;
			},
		},
	};
</script>
<style>
	.center {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ad {
		width: 620rpx;
		margin: atuo;
	}

	.big-cover {
		margin: -30rpx;
	}
	.mb-30{
		margin-bottom: -30rpx;
	}
	.li-tt{
		margin: -20rpx 0;
	}
</style>
