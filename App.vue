<script>
	
	export default {
		onLaunch: function() {
			console.log('APP onLaunch');
			uni.hideTabBar();
			// #ifdef MP-BAIDU
			this.$store.dispatch('setAdList');
			// #endif
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style>
	/*每个页面公共css */
</style>
