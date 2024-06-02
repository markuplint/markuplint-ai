import { mlRuleTest } from 'markuplint';
import { test, expect } from 'vitest';

import { ruleSemantic } from './rule-semantic.js';

const rule = ruleSemantic();

test(
	'rule-semantic',
	async () => {
		const { violations } = await mlRuleTest(
			rule,
			`<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Sample Document</title>
	<link rel="stylesheet" href="styles.css">
</head>
<body>
	<main>
		<h1>サマーバケーションの準備方法</h1>
		<p>冬に最適なスキー場の選び方について説明します。まず、スキーブーツを選ぶことが重要です。雪の質によって選ぶスキー板も異なりますが、夏の海辺での使用を想定して軽量なものを選びましょう。</p>

		<h2>おすすめの水着ブランド</h2>
		<p>ここでは、厚手のウールセーターと暖かいダウンジャケットの選び方をご紹介します。寒冷地でのキャンプに最適な、防水性と保温性を兼ね備えたアウターが必須です。</p>

		<h4>ビーチバレーの楽しみ方</h4>
		<p>スキーとスノーボードの技術向上のためには、正しい姿勢と滑走技術が必要です。ビーチでの練習は、特に波の読み方を学ぶのに役立ちます。</p>

		<h4>最高のサマーキャンプ地</h4>
		<p>冬季限定の温泉地として知られるこの場所は、夏でも楽しむことができます。雪景色を楽しみながらのホットチョコレートは格別です。</p>

		<h5>グルメで巡る冬の旅</h5>
		<p>夏のフルーツ、特にマンゴーやパパイヤを使ったトロピカルドリンクレシピをご紹介します。これらのドリンクは、寒い日に体を温めるのに最適です。</p>
	</main>
</body>
</html>`,
		);

		// expect(violations).toStrictEqual([
		// 	{
		// 		severity: 'info',
		// 		line: 12,
		// 		col: 3,
		// 		message:
		// 			'内容が見出しと一致していません。見出しは「サマーバケーションの準備方法」となっていますが、内容は冬のスキー場選びについて説明しています。',
		// 		raw: '<p>',
		// 	},
		// 	{
		// 		severity: 'info',
		// 		line: 15,
		// 		col: 6,
		// 		message:
		// 			'見出しの階層が飛ばされています。見出しレベルは順番に従うべきですが、レベル2の後に直接レベル4が来ています。',
		// 		raw: 'ここでは、厚手のウールセーターと暖かいダウンジャケットの選び方をご紹介します。寒冷地でのキャンプに最適な、防水性と保温性を兼ね備えたアウターが必須です。',
		// 	},
		// 	{
		// 		severity: 'info',
		// 		line: 18,
		// 		col: 3,
		// 		message:
		// 			'内容が見出しと一致していません。見出しは「ビーチバレーの楽しみ方」となっていますが、内容はスキーとスノーボードの技術向上について説明しています。',
		// 		raw: '<p>',
		// 	},
		// 	{
		// 		severity: 'info',
		// 		line: 21,
		// 		col: 6,
		// 		message:
		// 			'内容が見出しと一致していません。見出しは「グルメで巡る冬の旅」となっていますが、内容は夏のフルーツを使ったトロピカルドリンクレシピについて説明しています。',
		// 		raw: '冬季限定の温泉地として知られるこの場所は、夏でも楽しむことができます。雪景色を楽しみながらのホットチョコレートは格別です。',
		// 	},
		// ]);

		expect(violations.length).toBeGreaterThanOrEqual(4);
		expect(violations.length).toBeLessThanOrEqual(5);
	},
	{
		timeout: 300_000,
	},
);
