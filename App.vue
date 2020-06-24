<script>
	export default {
		onLaunch: function() {
			console.log('APP onLaunch');
			// #ifdef MP-BAIDU
			this.$store.dispatch('setAdList');
			this.$store.dispatch('getMsgNum');
			// 页面销毁自动清除定时器，不用写
			setInterval(() => {
				this.$store.dispatch('getMsgNum');
			}, 4 * 60 * 1000);
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
