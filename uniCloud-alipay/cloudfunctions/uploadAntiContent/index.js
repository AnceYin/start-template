/**
 * 备注：内部方法请勿使用
 * 描述：间隔一段时间从antiContent池中刷新antiContent队列的条数
 * 进度：尚未开始
 */

// 加入格式：
// [
// 	{"anti":"123"},
// 	{"anti":"456"}
// ]

const db = uniCloud.database();
const dbCmd = db.command;

'use strict';
exports.main = async (event, context) => {
	// let add = await db.collection("DuoDuoAntiContent").remove(); // 删库
	let add = await db.collection("DuoDuoAntiContent").add([]);
	console.log(add)
};