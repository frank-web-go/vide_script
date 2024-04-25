/*随机获取16位组成的key值*/
export const  sumKey = (decision,showKey = 16)=>{
	// 创建变量,创建存值数组,写出默认字母数组
	let num,
	numKey = [],
	arrKey = ['q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'];
	function showNum(){
			// 获取随机数 * 100 截取随机数.前几位
			num = parseInt(Math.random() * 100);
			if(arrKey[num] !== undefined && arrKey[num + 1] !== undefined && arrKey[num - 1] !== undefined){
			if(decision === 'a' && num <= arrKey.length){
				if(numKey.indexOf(arrKey[num]) === -1)numKey.push(arrKey[num]);
			}else if(decision === 'A' && num <= arrKey.length){
				if(numKey.indexOf(arrKey[num].toUpperCase()) === -1)numKey.push(arrKey[num].toUpperCase());
			}else if(decision === 'aA'){
				if(numKey.indexOf(arrKey[num].toUpperCase() + arrKey[num + 1]) === -1)numKey.push(arrKey[num].toUpperCase() + arrKey[num + 1]);
			}else if(decision === 'aA1'){
				if(numKey.indexOf(arrKey[num].toUpperCase() + arrKey[num + 1] + num) === -1)numKey.push(arrKey[num].toUpperCase() + arrKey[num + 1] + num);
			}else {
				return console.error(`传入的格式不对;
				获取随机小写字母${showKey}位,请输入'a';
				获取随机大写字母${showKey}位,请输入'A';
				获取随机大小写拼接字母${showKey}位,请输入'aA';
				获取随机小写加大写加数组${showKey}位,请输入'aA1'`);
			};
			};
			if(numKey.length === showKey)return numKey;
			showNum();
	};
			showNum();
			return numKey.length === 0 ? console.error('请输入正确的参数格式') : numKey.join('-',',');
};
			