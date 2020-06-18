<template>
	<view class="home-tab">
		<xhtabs>
			<xhtab :title="item.name" :name="index" v-for="(item,index) in tabList" :key="item.name" activeColor="red" v-model="activeIndex"
			 @click="tabChange"></xhtab>
		</xhtabs>
		<block v-for="(item,index) in tabData" :key="index" v-if="index === activeIndex">
			<scroll-view :scroll-y="scrollActive" @scrolltolower="getRecomData" class="scroll-wrap">
				<WaterFall :allData="item" :index="index" :col="2"></WaterFall>
				<!--加载更多时动画-->
				<bottomLoadMore :show="!finished[index]"></bottomLoadMore>
				<!--默认text-->
				<bottomText :show="finished[index]"></bottomText>
			</scroll-view>
		</block>

	</view>
</template>

<script>
	import {
		request
	} from "@/utils/request.js";
	import xhtabs from '@/components/tabs/Tabs.vue';
	import xhtab from '@/components/tabs/Tab.vue';
	import BottomLoadMore from "@/components/common/bottomLoadMore";
	import BottomText from "@/components/common/bottomText";
	import WaterFall from "@/components/waterFall/WaterFall.vue";

	export default {
		name: "HomeTab",
		components: {
			xhtabs,
			xhtab,
			WaterFall,
			BottomLoadMore,
			BottomText,
		},
		props: {
			scrollActive: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				activeIndex: 0,
				tabList: [],
				tabData: [],
				nextUrls: [],
				loading: [],
				finished: [],
			};
		},
		methods: {
			// tab基础数据及第一屏数据
			getTabData() {
				request("/baidu/v1/index/home?").then(res => {
					var res = res.data;
					this.tabList = res.tabList;
					this.tabList.forEach((item, index) => {
						this.nextUrls[index] = "type=" + this.tabList[index].type;
						this.tabData[index] = [];
						if (item.type == res.type) {
							this.activeIndex = index;
						}
					});
					this.tabData[this.activeIndex] = res.first.list;
					this.$set(
						this.tabData,
						this.activeIndex,
						this.tabData[this.activeIndex]
					);
					this.nextUrls[this.activeIndex] = res.first.nextUrl;
				});
			},
			// 请求推荐数据
			getRecomData() {
				return new Promise(resolve => {
					if (this.loading[this.activeIndex]) return;
					if (this.finished[this.activeIndex]) return;
					this.loading[this.activeIndex] = true;
					request(
						"/baidu/v1/index/recom?" + this.nextUrls[this.activeIndex] || ""
					).then(res => {
						var res = res.data;
						this.tabData[this.activeIndex] = [
							...(this.tabData[this.activeIndex] || []),
							...res.list
						];
						this.$set(
							this.tabData,
							this.activeIndex,
							this.tabData[this.activeIndex]
						);
						this.tabData[this.activeIndex].forEach((item, index) => {
							this.tabData[this.activeIndex][index].index = index;
						});
						this.nextUrls[this.activeIndex] = res.nextUrl;
						this.loading[this.activeIndex] = false;
						// 不知道最后一页明确界限，暂时不写
						// this.finished[this.activeIndex] = res.isEnd == 1 ? false : true;
						resolve();
					});
				});
			},
			// tab切换
			tabChange(name) {
				this.activeIndex = name;
				if (this.tabData[this.activeIndex].length === 0) {
					this.getRecomData()
				}
			},
		},
		created() {
			this.getTabData();
		}
	};
</script>

<style lang="less">
	.home-tab {
		border-top: 10rpx solid #f3f3f3;

		.tab {
			.title {
				font-weight: bold;
			}
		}

		.scroll-wrap {
			width: 100%;
			box-sizing: border-box;
			height: calc(100vh - 195rpx - 48px);
			background-color: #FFFFFF;
			padding: 20rpx 40rpx;
		}
	}
</style>
