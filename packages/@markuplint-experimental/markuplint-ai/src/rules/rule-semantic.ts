import { createRule } from '@markuplint/ml-core';
import { fromDocument, toLiteTree } from '@markuplint-experimental/accessibility-tree';
import 'dotenv/config';
import OpenAI from 'openai';

type Options = {
	OPENAI_API_KEY?: string;
	model?: string;
};

export const ruleSemantic = () =>
	createRule<boolean, Options>({
		defaultSeverity: 'info',
		defaultOptions: {
			OPENAI_API_KEY: process.env.OPENAI_API_KEY,
			model: 'gpt-4-turbo',
		},

		async verify({ document, report }) {
			if (!document.rule.options.OPENAI_API_KEY) {
				report({
					message: 'OpenAI API key is not set.',
					line: 1,
					col: 1,
					raw: '',
				});
				return;
			}

			const tree = fromDocument(document);
			const lite = toLiteTree(tree);

			// console.log(lite.tree);

			const openai = new OpenAI({
				apiKey: document.rule.options.OPENAI_API_KEY,
			});

			const res = await openai.chat.completions.create({
				model: document.rule.options.model!,
				temperature: 0,
				messages: [
					{
						role: 'user',
						content: [
							'The accessibility tree is represented as follows:',
							'- `role(props)=accname`',
							'- The depth of the structure is indicated by indentation.',
							'',
							'- Evaluate this accessibility tree based on the WCAG standards.',
							'- Only detect and provide reasons for the lines that are not compliant.',
							'- If there is a contradiction between headings and content, identify the heading line for detection.',
							'',
							'Answer format:',
							'- line: {line number}',
							'- reason: {reason}',
							'\nPlease answer reasons in Japanese.',
						].join('\n'),
					},
					{
						role: 'user',
						content: lite.tree.join('\n'),
					},
				],
			});

			const answer = res.choices[0]?.message.content;

			if (!answer) {
				report({
					message: 'Failed to get the answer from OpenAI.',
					line: 1,
					col: 1,
					raw: '',
				});
				return;
			}

			const result = parseResult(answer);

			for (const { line, reason } of result) {
				const node = lite.nodeMap.get(line);
				if (!node) {
					continue;
				}

				report({
					scope: node.host,
					message: reason,
				});
			}
		},
	});

function parseResult(text: string) {
	const lines = text
		.split('\n')
		.map(line => line.trim())
		.filter(Boolean);

	const result: { line: number; reason: string }[] = [];

	// Each two lines are a pair of line and reason
	for (let i = 0; i < lines.length; i += 2) {
		const lineNumStr = lines[i]?.match(/line:\s(?<line>\d+)/)?.groups?.line;
		if (!lineNumStr) {
			continue;
		}

		const lineNum = Number.parseInt(lineNumStr, 10);
		const reason = lines[i + 1]?.replace('- reason: ', '');

		if (!reason) {
			continue;
		}

		result.push({ line: lineNum, reason });
	}

	return result;
}
