<template>
	<view>
		<swiper class="video-box" :autoplay="autoplay" :duration="duration" :circular="false" :vertical="true" @change="change">
			<block v-for="(item,index) in videoList" :key="item.key" :index="index">
				<swiper-item class="video-wrap">
						<video :src="item.url" class="video" :autoplay="item.play" :id="'video'+index"></video>
						<cover-view class="url">
							<cover-image src="/static/images/meishijia-icon.png"></cover-image>
						</cover-view>
					
				</swiper-item>
			</block>
		</swiper>
		<custom-tab-bar></custom-tab-bar>
	</view>

</template>

<script>
	import {
		request
	} from "@/utils/request.js";
	export default {
		data() {
			return {
				indicatorDots: false,
				autoplay: false,
				duration: 300,
				videoList: [
					{
						url:'https://v5.cdn.xiangha.com/video/201903/2801/y_rt2/5c9bb4b340b49/eGg3MjBw.mp4?v=1.1&sign=994fdf397ca052a4dee2f6de240c5dac&t=5eff30dc',
						play:true
					},
					{
						url:'https://v4.cdn.xiangha.com/video/201903/1323/y_rt2/5c8923fb58948/eGg3MjBw.mp4?v=1.1&sign=f0d789ac65837307013bfdadf39113eb&t=5eff3dd8',
					},
					{
						url:'https://v4.cdn.xiangha.com/video/201811/2713/y_rt2/5bfcdaff2916c/eGg3MjBw.mp4?v=1.1&sign=78234258745cbdd44480782f9909f78e&t=5eff313b',
					},
				],
				currentIndex:0
			}
		},
		methods: {
			change(e){
				var index = e.detail.current;
				uni.createVideoContext('video'+this.currentIndex).pause();
				uni.createVideoContext('video'+index).play();
				this.currentIndex = index;
			},
		},
		

	};
</script>
<style lang="less">
	.video-box {
		width: 100%;
		height: calc(100vh - 48px);
		.video{
			width: 100%;
			height: calc(100vh - 48px);
		}
	}
	.video-wrap{
		position: relative;
		.url{
			position: absolute;
			right: 0;
			top: 0;
		}
	}
</style>
