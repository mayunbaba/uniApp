<template>
	<view class="center">
		<view v-if="adList[adPos].apid" class="ad">
			<ad :appid="adList[adPos].appid" :apid="adList[adPos].apid" :type="adList[adPos].type"
			:class="{'big-cover':adList[adPos].type == 'feed'}"
			 ></ad>
		</view>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				data: {}
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
			}
		},
	};
</script>
<style>
	.center{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.ad{
		width: 670rpx;
		margin: atuo;
	}
	.big-cover{
		margin: -30rpx;
	}
</style>

