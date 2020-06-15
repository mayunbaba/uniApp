<template>
  <!--所有的item都展示同一个图片, 同一个文字-->
  <view class="tab" @click="itemClick">
    <view v-if="!isActive">
      <slot name="item-icon"></slot>
    </view>
    <view v-else>
      <slot name="item-icon-active"></slot>
    </view>
    <view class="text-wrap">
      <text class="title">{{title}}</text>
    </view>
    <view :style="activeStyle"></view>
  </view>
</template>

<script>
export default {
  name: "Tab",
  props: {
    name: {
      default: 0
    },
    title: {
      type: String
    },
    activeColor: {
      type: String,
      default: "red"
    },
    value: {
      default: 0
    }
  },
  data() {
    return {
      top: 0
    };
  },
  computed: {
    isActive() {
      return this.name == this.value;
    },
    activeStyle() {
      return this.isActive
        ? {
            position: "absolute",
            bottom: "0",
            left: "50%",
            transform: "translate(-50%,0)",
            width: "47px",
            height: "3px",
            background: this.activeColor
          }
        : {};
    }
  },
  methods: {
    itemClick() {
      this.$emit("click", this.name);
    },
	},
};
</script>

<style  lang="less" scoped>
.tab {
  flex: 1;
  text-align: center;
  height: 44px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  img {
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }
}
</style>
