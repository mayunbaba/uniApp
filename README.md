开发过程遇到问题
1.子组件遍历多个slot，父组件拿不到子组件数据（瀑布流布局中，未实现瀑布流组件与单个卡片分离）
2.vuex store挂载到vue父类（需要采用mapState，mapMutations来使用）
3.微信小程序中 :style = "Object" 会出现无法解析的情况
4.createSelectorQuery
	微信中需要添加.in(this)  this为DOM节点所在组件，this.$children[0] 角标为组件在页面的引入顺序
	其他小程序添加 .in(this) 可能无法获取到组件，所以需要条件编译
5.父组件传递对象到子组件报错 
	支付宝小程序无规律报错（忽略）
6.getCurrentPages 
	获取上个页面参数兼容问题较多，采用传参方式
7.自定义组件tabs，tab
	名称与百度小程序组件重复，优先解析百度小程序ui（修改命名）
8.百度小程序不会自动更新	
9.官方提供自定义tabbar方式在uniapp无法使用（自定义tabbar组件）
	
 
 待开发部分
视频页面切换到视频页面，video出错，无法展示(仅在支付宝中如此)
收藏数据存储到vuex中
评论
