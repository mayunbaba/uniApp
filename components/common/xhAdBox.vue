<template>
	<view>

		<view v-if="adList[adPos].apid">
			<!-- #ifdef MP-BAIDU -->
			<ad :appid="adList[adPos].appid" :apid="adList[adPos].apid" :type="adList[adPos].type" class="ad"></ad>
			<!-- #endif -->
			
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

