/**
* 传入参数link
* 1. 不跳转
* [直接不填]
*
* 2. 跳转到自己页面
* #自己://non-tabbar/pages/test/test
*
* 3. 跳转到其他小程序页面，默认半屏
* #小程序://appid/wx29caaaceb642d2ec/pages/index/index?scene=Z424040036
* #小程序://non-appid/欢乐斗地主/GjzOGIjWtG6jwcu
*
* 4. 跳转到公众号文章
* #公众号://non-web-view/mp.weixin.qq.com/s/mt3wmRUpnBrUPuuqPskklw
*
* 5. 跳转到视频号视频
*
* #视频号://non-channel-video/sphskqvI071FiSH/export/UzFfAgtgekIEAQAAAAAA1TgjvzlwBgAAAAstQy6ubaLX4KHWvLEZgBPEl6d4QDMHO7qLzNPgMJqqq9WKQIdwV2H8lG66bd7Y
* #视频号://channel-video/sphskqvI071FiSH/feedToken
*
* 6. 跳转到h5，目前只有web-view一种跳转方式
* #h5://web-view/ance.run
*
* 7. 跳转到app，只有button一种方式，且需要满足一定条件
* #app://button/这里写传给app的参数
*
* 8. 其它跳转，建议使用下述规范，可以在事件otherJump中接收被转换的参数
* #跳转名://跳转方式/跳转参数
*
*
* 传入参数custom-class
* 自定义样式类
*
*
* 插槽
* 当不涉及其他模板时，可以选择传入自定义模板
*
*
* 传出参数{linkArr, paramArr, linkFun}
* 可直接使用跳转方法
*
*/

<template>
	<web-view v-if="linkArr[2] == 'web-view'" :src="'https://'+linkArr[3]"></web-view>
	<channel-video v-else-if="linkArr[2] == 'channel-video'" :finder-user-name="paramArr[1]" :feed-token="paramArr[2]"
		:autoplay="true"></channel-video>
	<button v-else-if="linkArr[2] == 'button'" open-type="launchApp" :app-parameter="linkArr[3]"></button>
	<view v-else @click="linkFun" :class="props.customClass">
		<slot></slot>
	</view>
</template>

<script setup>
	const props = defineProps({
		link: {
			type: String,
			default: ''
		},
		customClass: {
			type: String,
			default: 'default-class'
		}
	})
	const emit = defineEmits(['otherJump']);

	let linkArr = props.link.match(/#([^:]+):\/\/([^\/]+)\/(.+)/) || ["", "", "", ""];
	let paramArr = linkArr[3].match(/^([^\/]+)\/(.*)$/) || ["", "", ""];

	function linkFun(param = props.link) {
	    if (typeof param === 'object') {
	        return;
	    }
		linkArr = param.match(/#([^:]+):\/\/([^\/]+)\/(.+)/) || ["", "", "", ""];
		paramArr = linkArr[3].match(/^([^\/]+)\/(.*)$/) || ["", "", ""];
		switch (linkArr[1]) {
			case "":
				// 格式不正确
				break;
			case "自己":
				if (linkArr[2] == "non-tabbar") { // 跳非tabBar页面
					uni.navigateTo({
						url: '/' + linkArr[3]
					})
				} else if (linkArr[2] == "tabbar") { // 跳转到tabBar页
					uni.switchTab({
						url: '/' + linkArr[3]
					});
				}
				break;
			case "小程序":
				if (linkArr[2] == "appid") {
					wx.openEmbeddedMiniProgram({
						appId: paramArr[1],
						path: '/' + paramArr[2]
					})
				} else if (linkArr[2] == "non-appid") {
					wx.openEmbeddedMiniProgram({
						shortLink: "#小程序://" + linkArr[3]
					})
				}
				break;
			case "公众号":
				if (linkArr[2] == "non-web-view") {
					wx.openOfficialAccountArticle({
						url: 'https://' + linkArr[3]
					});
				}
				break;
			case "视频号":
				if (linkArr[2] == "non-channel-video") {
					wx.openChannelsActivity({
						finderUserName: paramArr[1],
						feedId: paramArr[2]
					})
				}
				break;
			case "h5":
				break;
			case "app":
				break;
			default:
				emit('otherJump', {
					linkArr,
					paramArr
				})
				break;
		}
	}

	defineExpose({
		linkArr,
		paramArr,
		linkFun
	})
	// 父组件使用方式：
	// <jump :link="link" ref="jumpRef"></jump>
	// import { onMounted,ref } from 'vue';
	// const link = ref("#自己://non-tabbar/pages")
	// const jumpRef = ref(null)
	// onMounted(()=>{jumpRef.value.linkFun()}) // 或直接在点击事件中使用
</script>

<style scoped lang="scss">
	.default-class {}
</style>