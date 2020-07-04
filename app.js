'use strict';
//ファイルシステム呼び出し
const fs = require('fs');
//ファイルを1行ずつ読み込む
const readline = require('readline');

//ファイルの読み込みを行うStreamを生成。
const rs = fs .createReadStream('./popu-pref.csv');
//readlineオブジェクトのinputと設定し、rl生成
const rl = readline.createInterface({input:rs, output: {} });
//key:都道府県,value:集計データのオブジェクト
const prefectureDateMap = new Map();

//イベント発生ごとにlineString関数呼び出し
rl.on('line', lineString => {
    //文字列を,で分割し配列とする。
    const columns = lineString.split(',');
    //集計年を0番目の配列に格納
    const year = parseInt(columns[0]);
    //都道府県名を1番目の配列に格納
    const prefecture = columns[1];
    //15~19歳の人口を数値型に変換し、3番目の配列に格納
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
        //連想配列からデータの取得
        let value = prefectureDateMap.get(prefecture);
        //その県のデータが初めての場合,valueオブジェクト初期化
        if(!value) {
        value = {
            popu10: 0,
            popu15: 0,
            change: null
        };
    }
    if(year === 2010) {
        value.popu10 = popu;
    }
    if(year === 2015) {
        value.popu15 = popu;
    }
    //連想配列に都道府県をキーとし、県のデータオブジェクトを値として登録
    prefectureDateMap.set(prefecture,value);
    }
});

//すべての行を読み終えたあとlogを出力
rl.on('close',() =>{
    //Mapの中身をループさせて、各都道府県の変化率を出している。
    for(let [key, value] of prefectureDateMap) {
        value.change = value.popu15 / value.popu10;
    }
    //連想配列を普通の配列に変え、sort関数の呼び出し
    const rankingArray = Array.from(prefectureDateMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key,value]) => {
        return (
            key +
            ': ' +
            value.popu10 +
            '=>' +
            value.popu15 +
            ' 変化率:' +
            value.change
        );
    });
    console.log(rankingStrings);

});
