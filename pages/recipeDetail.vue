<template>

	<view class="recipe-detail-page">
		<form @submit="submit" report-submit="false">
			<view class="con">
				<!-- #ifndef MP-ALIPAY -->
				<video v-if="model.isVideo == 2" class="video-box" :src="model.video.url" :poster="model.img" controls @error="onPlayError">
				</video>
				<image v-else class="video-box img-box" :src="model.img"></image>
				<!-- #endif -->
				<!-- #ifdef MP-ALIPAY -->
				<image class="video-box img-box" :src="model.img"></image>
				<!-- #endif -->
				<view class="kc-info">
					<text class="kc-title">{{model.name}}</text>
					<view class="rank-wrap">
						<view v-for="(item, index) in sorce" :key="index" key="index" index item>
							<image v-if="item == 1 " src="/static/images/cook/star.png"></image>
							<image v-else src="/static/images/cook/star-gray.png"></image>
						</view>
					</view>
					<view class="kc-data kc-data-first">
						<block v-if="baiduData.like_num">{{baiduData.like_num}}点赞</block>
						<block v-if="model.favorites"><text class="icon"> · </text>{{model.favorites}}</block>
					</view>
					<view class="kc-data">
						<block v-if="model.allClick">{{model.allClick}}</block>
						<block v-if="baiduData.make_times"><text class="icon"> · </text>{{baiduData.make_times}}做过</block>
						<block v-if="baiduData.ranking"><text class="icon"> · </text>站内排名{{baiduData.ranking}}</block>
					</view>
				</view>
				<view class="kc-info">
					<!-- 菜谱作者的话 -->
					<view class="author-say" v-if="model.info">{{model.info}}</view>
					<view class="author" v-if="model.customer.nickName">作者 ：{{model.customer.nickName}}</view>

					<view class="cook-wrap">
						<view class="cook">
							<view class="item">
								<image src="/static/images/cook/cook-icon-1.png" mode="aspectFit"></image><text>{{baiduData.cooking_time_info}}</text>
							</view>
							<view class="item">
								<image src="/static/images/cook/cook-icon-2.png" mode="aspectFit"></image><text>{{baiduData.tag_infos.flavor}}</text>
							</view>
							<view class="item">
								<image src="/static/images/cook/cook-icon-3.png" mode="aspectFit"></image><text>{{baiduData.difficulty_info}}</text>
							</view>
						</view>
						<view class="cook cook-last">
							<view class="item">
								<image src="/static/images/cook/cook-icon-4.png" mode="aspectFit"></image><text>{{baiduData.tag_infos.classify}}</text>
							</view>
							<view class="item">
								<image src="/static/images/cook/cook-icon-5.png" mode="aspectFit"></image><text>{{baiduData.tag_infos.cooking_method}}</text>
							</view>
							<view class="item">
								<image src="/static/images/cook/cook-icon-6.png" mode="aspectFit"></image><text>{{baiduData.tag_infos.cuisine}}</text>
							</view>
						</view>
					</view>


					<!-- 用料 -->
					<view class="yl-box" v-if="materialList.length">
						<view class="yl-title">用料</view>
						<view class="yl-ul">
							<view class="yl-li clearfix" v-for="(item, index) in materialListTotal" :key="index" @click="navTo('/pages/search?code=' + item.name)">
								<view class="l ellipsis">{{item.name}}</view>
								<view class="r ellipsis">{{item.content}}</view>
								<image src="/static/images/right-jian.png"></image>
							</view>
						</view>
					</view>
				</view>
				<xhAdBox :showAdBox="showAd" :adPos="'dishIngreBottom'" class="ad-100-wrap"></xhAdBox>
				<!-- 小技巧 -->
				<view class="xjq-box" v-if="skillList.isShow == 2">
					<view class="xjq-title">{{skillList.title}}</view>
					<scroll-view class="xjq-scroll-x-box" lower-threshold="50" scroll-x @scrolltolower="more">
						<view class="xjq-scroll-item" v-for="(item, index) in skillList.list" :key="index">
							<view @click="navTo('/pages/recipeDetail?dishCode=' + item.dishCode + '&chapterCode=' + item.chapterCode + '&courseCode=' + item.courseCode,openType)">
								<image :src="item.img" lazy-load="true" class="xjq-scroll-image">
									<image class="xjq-mask" src="/static/images/shadow.png"></image>
									<view v-if="item.iconType == 2" class="vip-t br-4">VIP</view>
									<view v-if="item.iconType == 1" class="vip-t br-4 look">试看</view>
									<view v-if="item.videoTime" class="time-t">{{item.videoTime}}</view>
								</image>
								<text class="xjq-name ellipsis">{{item.text}}</text>
							</view>
						</view>
					</scroll-view>
				</view>
				<!-- 做法 -->
				<view class="zf-box">
					<view class="zf-title" v-if="wouldList.list.length">做法</view>
					<block v-if="wouldList.list.length">
						<block v-if="wouldList.isCourseDish == 2">
							<!-- 是课程;全部是图 -->
							<view class="zf-li zf-li-wuf" v-for="(item, index) in wouldList.list" :key="index">
								<image class="zf-img" :src="item.img" @click="previewImage(item.img)"></image>
							</view>
						</block>
						<block v-else>
							<!-- 非课程;可能是图片+gif步骤图 -->
							<view class="zf-li" v-for="(item, index) in wouldList.list" :key="index">
								<image v-if="item.video.gif || item.img" :src="item.video.gif || item.img" class="zf-img" mode="aspectFill"
								 @click="previewImage(item.img)"></image>
								<text class="zf-bz" v-if="!(!isOpenWould && index == 3)"><text class="zf-bz-num">{{item.num}}/</text><text
									 class="num-total">{{wouldListTotal.length}}</text>{{item.info}}</text>
							</view>
							<view class="tips-wrap">
								<text class="bold">公告：</text>
								<text class="download-tips" v-if="isOpenWould">
									<!-- 搜索“<text class="red">香哈菜谱</text>”，看名厨视频菜谱，和百万哈友一起学做菜。 -->
									学做菜省时又方便，搜索“<text class="red">香哈菜谱</text>”，一款小巧的厨房工具提高烹饪技术，百万美食家的共同选择！
								</text>
							</view>
						</block>
					</block>
					<view @click="openWould" v-if="!isOpenWould" class="open-wrap">
						<view class="cover"></view>
						<view class="wrap">
							<view class="open">展开全部</view>
							<image src="/static/images/down-arrow.png"></image>
						</view>
					</view>
					<!-- 小贴士 -->
					<view class="zf-xts" v-if="model.remark.title">
						<view class="title">{{model.remark.title}}</view>
						<text class="con">{{model.remark.info}}</text>
					</view>
					<!-- 广告位 -->
					<view class="ad-box" v-if="model.banner.isShow == 2">
						<image :src="model.banner.img" @click="navTo(model.banner.url)"></image>
					</view>
				</view>
				<xhAdBox :showAdBox="showAd" :adPos="'dishTipsBottom'" class="ad-wrap"></xhAdBox>
				<!-- 相关菜谱 -->
				<view class="recomm-box" v-if="recipeList.length">
					<view class="recomm-title-box clearfix">
						<view class="title">为你推荐</view>
						<navigator class="more" :url="'/pages/search?code=' + model.name" hover-class="none">查看全部</navigator>
					</view>
					<image :src="nyfData.img" @click="navTo('/pages/h5?path=' + nyfData.url,'')" class="nyf-banner" mode="aspectFit"
					 v-if="nyfData.img"></image>
					<block v-for="(item,index) in recipeList" :key="item">
						<!-- #ifdef MP-BAIDU -->
						<view class="ad-wrap" v-if="index == 0 && showAd">
							<xhAdBox :adPos = '"recommend1"' :show="showAd"></xhAdBox>
						</view>
						<view class="ad-wrap" v-if="index == 3 && showAd">
							<xhAdBox :adPos = '"recommend2"' :show="showAd"></xhAdBox>
						</view>
						<view class="ad-wrap" v-if="index == 7 && showAd">
							<xhAdBox :adPos = '"recommend3"' :show="showAd"></xhAdBox>
						</view>
						<!-- #endif -->
						<searchItem :item="item" @click="navTo('/pages/recipeDetail?dishCode=' + item.code,openType)"></searchItem>
					</block>
					<bottomText :show.sync="showBottomText"></bottomText>
				</view>
			</view>
			<BottomBar :item="model" @setLike="setLike" @goPage="navTo('/pages/search?code=' + barText)"></BottomBar>

		</form>
	</view>

</template>

<script>
	import tip from "@/utils/tip";
	import utils from "@/utils/util";
	import {
		request
	} from '@/utils/request.js';
	import BottomLoadMore from "@/components/common/bottomLoadMore";
	import BottomText from "@/components/common/bottomText";
	import searchItem from '@/components/common/searchItem.vue';
	import BottomBar from '@/components/common/bottomBar.vue';
	import xhAdBox from '@/components/common/xhAdBox.vue';

	export default {
		data() {
			return {
				barText: '',
				// 菜谱查询标签
				userInfo: {},
				// 用户信息
				oCode: {},
				// code
				model: {},
				// 基础数据
				materialList: [],
				// 用料数据
				materialListTotal: [],
				//用料总数据
				isOpen: true, //用料是否展开
				skillList: {},
				// 小技巧数据
				wouldList: {},
				// 做法数据
				wouldListTotal: {},
				//做法总数居
				isOpenWould: true, //做法是否展开
				baiduData: '',
				sorce: [],
				recipeList: [],
				// 相关菜谱数据
				nyfData: {},
				//年夜饭活动数据
				openType: 'redirect',
				// 显示loading
				showBottomText: true,
				// 显示底部语
				makeUrl: [],
				pageInfo: null,
				showAd:true
			};
		},

		onLoad(options) {
			// 页面初始化 options为页面跳转所带来的参数
			var that = this;
			that.userInfo = this.$store.state.userInfo;
			tip.loading();
			that.oCode.dishCode = options.dishCode;
			that.getModel();
			that.getMaterialList(); // 获取用料数据
			that.getWouldList(); // 做法数据
			that.getRecipeList(); // 相关菜谱数据
		},


		components: {
			BottomLoadMore,
			BottomText,
			searchItem,
			BottomBar,
			xhAdBox
		},
		methods: {
			getModel() {
				let that = this;
				let params = {
					dishCode: that.oCode.dishCode
				};
				request("/v1/Dish/topInfo", params).then(res => {
					if (res.code == 10000 && res.data) {
						that.model = res.data;
						this.barText = res.data.name;
						this.baiduData = res.data.baidu_supply_infos;
						this.sorce = [];
						for (var i = 0; i < 5; i++) {
							if (i < this.baiduData.sorce) {
								this.sorce.push(1);
							} else {
								this.sorce.push(-1);
							}
						}
						uni.setNavigationBarTitle({
							title: that.model.name
						});
						that.pageInfo = res.data.pageInfo;
						tip.loaded();
					}
				});
			},

			getMaterialList() {
				let that = this;
				let params = that.oCode;
				request("/v1/Dish/getDishBurdenByCode", params).then(res => {
					if (res.code == 10000 && res.data) {
						that.materialListTotal = res.data;
						if (res.data.length > 3) {
							this.isOpen = false;
						}
						that.materialList = res.data.slice(0, 3);
						tip.loaded();
					}
				});
			},

			getWouldList() {
				let that = this;
				let params = that.oCode;
				request("/v1/Dish/dishMake", params).then(res => {
					if (res.code == 10000 && res.data) {
						that.wouldListTotal = res.data.list;
						if (that.wouldListTotal.length > 1) {
							that.makeUrl = that.wouldListTotal.map((item, index) => {
								if (!item.video.gif) {
									return item.img;
								} else {
									return item.video.gif;
								}
							});
						}
						if (that.wouldListTotal.length > 4) {
							this.isOpenWould = false;
						}
						that.wouldList.list = that.wouldListTotal.slice(0, 4);
						tip.loaded();
					}
				});
			},

			getRecipeList() {
				let that = this;
				let params = that.oCode;
				request("/v1/dish/relevantDish", params).then(res => {
					if (res.code == 10000 && res.data) {
						that.recipeList = res.data.list;
						that.nyfData = res.data.nyf;
					}
				});
			},

			onPlayError(e) {
				console.log('onPlayError, e=' + JSON.stringify(e));
			},


			//预览图片
			previewImage(url) {
				uni.previewImage({
					current: url,
					urls: this.makeUrl
				});
			},



			openMaterial() {
				this.materialList = this.materialListTotal;
				this.isOpen = true;
			},

			openWould() {
				this.wouldList.list = this.wouldListTotal;
				this.isOpenWould = true;
			},

			// 页面跳转
			navTo(url, openType) {
				utils.xhNavigateTo(url, openType);
			},

			// 收藏
			setLike() {
				let that = this;
				if (!this.$store.state.userInfo.code) {
					utils.xhNavigateTo('/pages/login?');
					return;
				}
				let params = {
					code: that.oCode.dishCode,
					type: 1,
					typeName: that.model.name
				};
				request("/V1/Fav/setFav", params).then(res => {
					if (res.code == 10000 && res.data) {
						that.model.isFavorites = res.data;
						if (res.data == 2) {
							tip.toast('收藏成功');
							this.$store.commit('changeDishData',{
								type:'add',
								dish: that.model,
							});
						} else {
							tip.toast('取消成功');
							this.$store.commit('changeDishData',{
								type:'del',
								dish: that.model,
							});
						}
					}
				});
			},
		},
	};
</script>
<style lang="less">
	.recipe-detail-page {
		height: 100vh;

		// padding-top: 100rpx;
		.con {

			// background: #f3f3f3;
			/*padding-bottom: 100rpx;*/
			&.has-follow {
				padding-top: 100rpx;
			}

			.follow-banner-box {
				position: fixed;
				top: 0;
				width: 100%;
				height: 100rpx;
				padding: 0 30rpx 0 20rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #fff;
				z-index: 11;

				.close-btn {
					background: transparent;
				}

				.img-close {
					width: 18rpx;
					height: 18rpx;
				}

				.img-logo {
					width: 76rpx;
					height: 76rpx;
					margin: 0 20rpx;
				}

				.text {
					width: 377rpx;
					font-size: 24rpx;
					line-height: 32rpx;
				}

				.share-btn {
					width: 156rpx;
					height: 58rpx;
					line-height: 58rpx;
					margin-left: 32rpx;
					text-align: center;
					background: #f23030;
					color: #fff;
					font-size: 28rpx;
					border-radius: 6rpx;
				}
			}

			.video-box {
				display: block;
				width: 100%;
				height: 422rpx;
				background: url("https://s2.cdn.xiangha.com/images/m5/Common/video-bg.png") no-repeat;
				background-size: 100% 100%;

				&.img-box {
					height: 500rpx;
				}
			}

			.video-layer {
				position: relative;
				width: 100%;
				height: 500rpx;
				background: #1b1b1f;

				// background: url("https://s2.cdn.xiangha.com/images/m5/Common/echo.png") no-repeat;
				// background-size: 100% 100%;
				.no-login {
					width: 100%;
					padding-top: 160rpx;
					text-align: center;
					font-size: 28rpx;
					color: #ffffff;

					.redT {
						display: inline;
						color: #f23030;
						text-decoration: underline;
						font-size: 28rpx;
					}
				}

				.no-vip {
					width: 100%;
					text-align: center;
					font-size: 28rpx;
					color: #ffffff;

					.redT {
						display: inline;
						color: #f23030;
						text-decoration: underline;
						font-size: 28rpx;
					}

					&:nth-child(1) {
						padding-top: 140rpx;
					}

					&:nth-child(2) {
						margin-top: 4rpx;
					}
				}

				.btn-box {
					margin: 72rpx auto 0;
					width: 510rpx;

					button {
						width: 228rpx;
						height: 60rpx;
						line-height: 60rpx;
						text-align: center;
						font-size: 28rpx;
						color: #ffffff;
						background: #f23030;
						border-radius: 36rpx;
					}

					button::after {
						border: 0 none;
					}

					.kait-btn {
						float: left;
					}

					.share-btn {
						float: right;
					}
				}

				.sign-btn {
					margin: 80rpx auto 0;
					width: 228rpx;
					height: 60rpx;
					line-height: 60rpx;

					text-align: center;
					border-radius: 36rpx;
					font-size: 30rpx;
					background: #f23030;
				}
			}

			.open-vip-box {
				padding: 0 44rpx;
				box-sizing: border-box;

				button {
					height: 82rpx;
					line-height: 82rpx;
					margin-top: 44rpx;
					background: #d39e54;
					color: #fff;
					font-size: 30rpx;
				}
			}

			.kc-info {
				padding: 0 40rpx;
				background: #ffffff;

				.kc-title {
					display: block;
					// height: 120rpx;
					line-height: 56rpx;
					padding-top: 50rpx;
					padding-bottom: 18rpx;
					text-align: center;
					font-size: 50rpx;
					font-weight: 700;
					color: #333333;
				}

				.kc-data {
					margin-top: 14rpx;
					margin-bottom: 44rpx;
					text-align: center;
					font-size: 24rpx;
					color: #999;

					.icon {
						display: inline-block;
						width: 20rpx;
					}
				}

				.kc-data-first {
					margin: 24rpx;
					margin: 16rpx;
				}

				.kc-sc {
					width: 296rpx;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					color: #fff;
					background-color: #fd2846;
					margin: 0 auto 68rpx;
					font-size: 34rpx;
				}

				.kc-gray {
					background-color: #bbb;
				}

				.kc-author-info-box {
					padding: 44rpx 0;
					display: flex;
					position: relative;
					align-items: center;

					.author-head-box {
						position: relative;
					}

					.author-head {
						width: 96rpx;
						height: 96rpx;
						border-radius: 50%;
						vertical-align: middle;

						.msj-icon {
							position: absolute;
							bottom: 3rpx;
							right: -4rpx;
							width: 32rpx;
							height: 32rpx;
							z-index: 999;
						}
					}

					.author-info {
						width: 410rpx;
						margin-left: 28rpx;
						position: relative;
						height: 96rpx;

						.name {
							display: inline-block;
							font-size: 34rpx;
							color: #444444;
							height: 50rpx;
							line-height: 56rpx;
							// padding-top: 14rpx;
						}

						.qm {
							width: 88%;
							font-size: 24rpx;
							color: #999999;
							height: 50rpx;
							line-height: 48rpx;
						}
					}

					.gz-btn {
						width: 120rpx;
						height: 54rpx;
						line-height: 52rpx;
						text-align: center;
						border: 1px solid #f23030;
						box-sizing: border-box;
						font-size: 26rpx;
						color: #f23030;
						background: #ffffff;
					}

					button::after {
						border: 0 none;
					}
				}

				.author-say {
					font-size: 34rpx;
					line-height: 52rpx;
					padding-bottom: 56rpx;
					text-align: justify;
				}

				.author {
					font-size: 36rpx;
					margin-bottom: 84rpx;
				}

				.yl-box {

					// margin-top: 56rpx;
					.yl-title {
						font-size: 36rpx;
						margin-bottom: 28rpx;
						font-weight: 700;
					}

					.yl-ul {
						.yl-li {
							width: 100%;
							padding: 18rpx 0;
							border-top: 0.5px solid #ececec;
							display: flex;

							.l {
								// float: left;
								width: 60%;
								font-size: 34rpx;
							}

							.r {
								// float: left;
								width: 30%;
								font-size: 34rpx;
								text-align: right;
								margin-right: 20rpx;
							}

							image {
								float: right;
								width: 16rpx;
								height: 24rpx;
								margin-right: 35rpx;
								margin-top: 12rpx;
							}

							&:nth-last-child(1) {
								border-bottom: 0.5px solid #ececec;
							}
						}
					}
				}
			}

			.xjq-box {
				display: block;
				background: #ffffff;

				.xjq-title {
					padding: 56rpx 0 28rpx 40rpx;
					font-size: 36rpx;
					text-align: left;
					font-weight: 700;
				}

				.xjq-scroll-x-box {
					width: 100%;
					white-space: nowrap;

					.xjq-scroll-item {
						display: inline-block;
						width: 226rpx;
						height: 202rpx;
						margin-right: 8rpx;
						position: relative;

						&:nth-child(1) {
							margin-left: 40rpx;
						}

						&:nth-last-child(1) {
							margin-right: 40rpx;
						}

						.xjq-scroll-image {
							position: relative;
							width: 100%;
							height: 159rpx;
							background: rgba(132, 134, 129, 0.533);
							border-radius: 8rpx;

							.xjq-mask {
								width: 100%;
								height: 150rpx;
								position: absolute;
								left: 0;
								bottom: 0;
							}

							.vip-t {
								position: absolute;
								top: 4rpx;
								right: 4rpx;
								width: 64rpx;
								height: 34rpx;
								line-height: 36rpx;
								text-align: center;
								background: #e2a95a;
								font-size: 22rpx;
								color: #ffffff;

								&.look {
									background: #45c300;
								}
							}

							.time-t {
								position: absolute;
								bottom: 10rpx;
								right: 10rpx;
								color: #ffffff;
								font-size: 22rpx;
							}
						}

						.xjq-name {
							display: block;
							width: 100%;
							position: absolute;
							left: 50%;
							transform: translate(-50%);
							bottom: -4rpx;
							text-align: center;
							font-size: 26rpx;
						}
					}
				}
			}

			.zf-box {
				padding: 0 40rpx 0;
				background: #ffffff;

				// border-bottom: 15rpx solid #f3f3f3;
				.zf-title {
					display: block;
					font-size: 36rpx;
					text-align: left;
					padding-top: 36rpx;
					font-weight: 700;
				}

				.zf-li {
					margin-top: 28rpx;

					.zf-img {
						position: relative;
						display: block;
						width: 100%;
						height: 446rpx;
						background: url("http://s2.cdn.xiangha.com/images/m5/Common/step-bg.png") no-repeat;
						background-size: 100% 100%;
						border-radius: 8rpx;

						.dt-t {
							position: absolute;
							bottom: 0;
							left: 0;
							width: 110rpx;
							height: 48rpx;
							line-height: 48rpx;
							text-align: center;
							color: #ffffff;
							font-size: 30rpx;
							background: rgba(0, 0, 0, 0.3);
						}
					}

					.zf-bz {
						display: inline-block;
						font-size: 34rpx;
						margin: 22rpx 0 32rpx 0;
						// height: 56rpx;
						line-height: 46rpx;

						.zf-bz-num {
							font-weight: 600;
						}

						.num-total {
							font-size: 24rpx;
							margin-left: -4rpx;
						}
					}

					&.zf-li-wuf {
						margin-top: 0;
						height: 446rpx;
					}
				}

				.no-zf-pic {
					display: none;
					width: 100%;
					height: 110rpx;
					margin-bottom: 40rpx;

					&.show {
						display: block;
					}

					&.hide {
						display: none;
					}
				}

				.zf-xts {
					padding: 38rpx 0 28rpx;

					.title {
						text-align: left;
						font-size: 36rpx;
						font-weight: 700;
					}

					.con {
						display: block;
						margin-top: 22rpx;
						font-size: 34rpx;
						background: #ffffff;
						line-height: 46rpx;
					}
				}

				.ad-box {
					width: 100%;
					height: 180rpx;
					margin-bottom: 40rpx;

					image {
						width: 100%;
						height: 180rpx;
					}
				}

				.share-btn {
					display: block;
					height: 88rpx;
					line-height: 88rpx;
					background: #f23030;
					font-size: 34rpx;
					margin-bottom: 40rpx;
					margin-top: 20rpx;
					border-radius: 10rpx;

					image {
						display: inline-block;
						width: 36rpx;
						height: 35rpx;
						vertical-align: -4rpx;
						margin-right: 6rpx;
					}
				}
			}

			.ad-box-wx {
				position: relative;
				padding: 0 40rpx;

				.ad-close-btn {
					position: absolute;
					right: 43rpx;
					top: 3rpx;
					width: 33rpx;
					height: 33rpx;
					z-index: 11;
				}
			}

			.recomm-box {
				border-top: 15rpx solid #f3f3f3;
				margin-top: 40rpx;
				background: #ffffff;

				.recomm-title-box {
					padding: 32rpx 40rpx;
					padding-top: 40rpx;

					.title {
						float: left;
						font-size: 36rpx;
						font-weight: 700;
						color: #444444;
					}

					.more {
						float: right;
						font-size: 26rpx;
						color: #999999;
						padding-top: 8rpx;
					}
				}
			}
		}

		.search-btn {
			position: fixed;
			bottom: 136rpx;
			right: 20rpx;
			width: 92rpx;
			height: 92rpx;

			image {
				width: 92rpx;
				height: 92rpx;
			}
		}
	}

	.nyf-banner {
		width: 670rpx;
		height: 162rpx;
		margin: 0rpx 40rpx 36rpx;
	}

	.open-wrap {
		box-sizing: border-box;
		padding-top: 27rpx;
		width: 100%;
		position: relative;

		.cover {
			position: absolute;
			width: 100%;
			height: 200rpx;
			bottom: 10px;
			background-image: linear-gradient(-180deg,
				rgba(255, 255, 255, 0) 0%,
				#ffffff 100%);
		}

		.wrap {
			position: absolute;
			bottom: 10px;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.open {
			font-size: 30rpx;
			color: #3e3e3e;
		}

		image {
			width: 29rpx;
			height: 30rpx;
			margin-left: 14rpx;
		}
	}

	// .ad-wrap {
	// 	padding: 20rpx 10rpx 0;

	// 	.line {
	// 		margin: 0 30rpx 20rpx;
	// 		border-top: 2rpx solid #ececec;
	// 	}
	// }

	.youliao-ad {
		margin-top: 20rpx;
		margin-bottom: -30rpx;
		padding: 0 12rpx;
	}

	.tips-wrap {
		border: 1rpx solid #ececec;
		border-radius: 10rpx;
		padding: 20rpx;

		.bold {
			font-weight: bold;
		}
	}

	.download-tips {
		color: gray;
		margin-bottom: 200rpx;

		.red {
			color: #f23030;
			// color: #f00;
			font-weight: bold;
		}
	}

	.rank-wrap {
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-bottom: 24rpx;

		image {
			width: 36rpx;
			height: 36rpx;
			margin: 0 4rpx;
		}
	}

	.cook-wrap {
		margin-top: 4rpx;
		margin-bottom: 58rpx;

		.cook {
			display: flex;
			flex-wrap: wrap;
			border-top: 1rpx solid #eee;

			.item {
				display: flex;
				align-items: center;
				width: 33%;
				height: 88rpx;

				image {
					width: 48rpx;
					margin-right: 12rpx;
				}

				&:nth-child(1) {
					justify-content: flex-start;
				}

				&:nth-child(2) {
					justify-content: center;
				}

				&:nth-child(3) {
					justify-content: flex-end;
				}
			}

			.cook-icon {
				width: .214286rem;
				margin-right: .053571rem;
			}
		}

		.cook-last {
			border-bottom: 1rpx solid #eee;
		}
	}

	.fix-bottom {
		position: fixed;
		bottom: 0;
		box-sizing: border-box;
		width: 100%;
		height: 110rpx;
		padding: 20rpx 30rpx;
		background: rgba(243, 243, 243, 0.95);
		display: flex;
		justify-content: space-between;

		.item {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 230rpx;
			height: 70rpx;
			background: #FD2846;
			border-radius: 35rpx;
			font-size: 28rpx;
			color: #FFFFFF;

			&.more {
				background: #FD9127;
			}

			&.welfare {
				position: relative;

				.icon {
					width: 79rpx;
					height: 28rpx;
					position: absolute;
					right: -20rpx;
					top: -14rpx;
				}
			}
		}

		.like {
			margin-top: 6rpx;
			width: 44rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			image {
				width: 36rpx;
				height: 33rpx;
			}

			.text {
				font-size: 22rpx;
				color: #333333;
			}
		}

		.share {
			margin-top: 6rpx;
			width: 44rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			image {
				width: 29rpx;
				height: 30rpx;
			}

			.text {
				margin-top: 3rpx;
				font-size: 22rpx;
				color: #333333;
			}
		}
	}
	.ad-wrap{
		margin: 36rpx 40rpx;
	}
</style>
