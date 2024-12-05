const axios = require('axios');
const qs = require('qs');
const db = uniCloud.database();
'use strict';

exports.main = async (event, context) => {
	try {
		// 从数据库获取 XYsDt 和 authorization
		const doc = await db.collection("TuXiAuthentication").doc("665c435093a03abf82fc11cd").get();
		const {
			XYsDt,
			authorization
		} = doc.data[0];

		console.log("从数据库获取XYsDt、authorization：");
		console.log(XYsDt);
		console.log(authorization);

		// 定义网络请求格式
		let data = qs.stringify({
			'data': `{"authorization":"${authorization}","deviceId":"b746cb22-edd5-4200-8ef6-6d6585d5a835","fromUrl":null,"operatingSystem":null,"platformName":"app","platformVersion":"4.38.2","redirectUrl":null,"site":null,"userAgent":null,"verifyId":null}`
		});

		let config = {
			method: 'POST',
			url: 'https://kdcsgateway.zt-express.com/gateway.do/',
			headers: {
				'Reqable-Id': 'reqable-id-1040c3d6-c170-4bdf-bf0d-28892979fa37',
				'User-Agent': 'Android:9 ;MI 9 ;Android; Version 4.38.2',
				'Connection': 'Keep-Alive',
				'Accept-Encoding': 'gzip',
				'Content-Type': 'application/x-www-form-urlencoded',
				'X-Zop-Name': 'tuxi.spm.account.accountLoginByPwd',
				'X-Ca-Version': '1',
				'X-App-Version': '4.38.2',
				'X-Ys-Dt': XYsDt,
				'X-Sv-V': 'com.zto.families.ztofamilies_4.38.2',
				'x-device-id': 'b746cb22-edd5-4200-8ef6-6d6585d5a835'
			},
			data: data
		};

		const response = await axios.request(config);
		console.log("请求到的accessToken:");
		console.log(response.data.result.accessToken);

		await db.collection("TuXiAuthentication").doc("665c435093a03abf82fc11cd").update({
			Token: response.data.result.accessToken
		});

	} catch (error) {
		console.log('error', error.message);
	}
};