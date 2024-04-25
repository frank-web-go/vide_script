import pako from "pako"
// 解压
function unzip(key) {
    var charData = [];
    var keyArray = key.split('');
    for(var i = 0; i < keyArray.length; i++){
        var item = keyArray[i];
        charData.push(item.charCodeAt(0));
    }

    // var binData = new Uint8Array(charData);
    // console.log('Uint8Array:' + binData);
    // 解压
    // var data = pako.inflate(binData);
    var data = pako.inflate(charData);

    // 将GunZip ByTAREAR转换回ASCII字符串
    // key = String.fromCharCode.apply(null, new Uint16Array(data));

    key = String.fromCharCode.apply(null, data);

    return decodeURIComponent(Base64.decode(key));
}
export default unzip