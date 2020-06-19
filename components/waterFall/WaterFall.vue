<template>
	<div class="water-fall">
		<div v-for="(item,index) in waterData" :key="index">
			<div :class='"item"+index'>
				<div v-for="($item,$index) in item" :key="$index">
					<DishItem :item="$item" :imgWid="imgWid"></DishItem>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import DishItem from "@/components/dishItem/DishItem";
	export default {
		name: "WaterFall",
		props: {
			allData: {
				type: Array
			},
			col: {
				type: Number,
				default: 2
			},
			index: {
				type: Number,
				default: 0
			}
		},
		components: {
			DishItem
		},
		data() {
			return {
				times: 0,
				list: [], //每次的增量数据
				waterData: [],
				imgWid: 160,
			};
		},
		
		watch: {
			allData: {
				handler(newValue, oldValue) {
					console.log(newValue, oldValue,'watch');
					if(oldValue){
						this.list = newValue.slice(oldValue.length);
					}else{
						// 旧值为空
						this.list = newValue;
					}
					this.updateWaterfall();
				},
				immediate: true

			}
		},
		methods: {
			updateWaterfall() {
				let itemH = [];
				let item = this.list.shift();
				let viewShortIndex = 0;
				if (item == null) {
					return;
				}
				let query = uni.createSelectorQuery();
				for (let i = 0; i < this.col; i++) {
					try {
						query
							// #ifdef MP-WEIXIN
							.in(this)
							// #endif
							.select(".item" + i).boundingClientRect();
					} catch {
						console.log('无法获取dom元素')
					}
				}
				query.exec(res => {
					itemH = res.map((item) => {
						if (item) {
							return item.height
						} else {
							return 0
						}
					});
					viewShortIndex = itemH.indexOf(Math.min.apply(Math, itemH));
					this.waterData[viewShortIndex].push(item);
					this.$nextTick(() => {
						this.updateWaterfall();
					});
				});
			},
		},
		created() {
			for (let i = 0; i < this.col; i++) {
				this.waterData.push([]);
			}
			// this.list = JSON.parse(JSON.stringify(this.allData));
			this.$nextTick(() => {
				// this.updateWaterfall();
				let query = uni.createSelectorQuery();
				query
					// #ifdef MP-WEIXIN
					.in(this)
					// #endif
					.select('.water-fall')
					.boundingClientRect(res => {
						if (res) {
							this.imgWid = (res.width - 15) / this.col;
						}
					})
					.exec();
			});


		}
	};
</script>

<style lang="less" scoped>
	.water-fall {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
</style>
