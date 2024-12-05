/**
 * 备注：内部方法请勿使用
 * 描述：间隔一段时间刷新微信小程序的token
 * 进度：已完成, 间隔时间为1小时
 */

// ["0 0 */1 * * *"]

const axios = require('axios');
const db = uniCloud.database();
'use strict';

exports.main = async (event, context) => {
  // 从数据库获取 wxAppID 和 wxAppSecret
  const doc = await db.collection("WeChatAuthentication").doc("665c437c90a85d15ac161d82").get();
  const { wxAppID, wxAppSecret } = doc.data[0];
  
	console.log("从数据库获取wxAppID、wxAppSecret：")
	console.log(wxAppID)
	console.log(wxAppSecret)
  // 配置请求参数
  let config = {
    method: 'GET',
    url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxAppID}&secret=${wxAppSecret}`,
    headers: {
      'Reqable-Id': 'reqable-id-6af99d1c-0bf7-4c01-b731-84826d04e206'
    }
  };

  // 发送请求并获取响应
  const response = await axios.request(config);
	console.log("微信返回的数据：")
	console.log(response)
  // 更新数据库中的 accessToken
  await db.collection("WeChatAuthentication").doc("665c437c90a85d15ac161d82").update({
    accessToken: response.data.access_token
  });
};
