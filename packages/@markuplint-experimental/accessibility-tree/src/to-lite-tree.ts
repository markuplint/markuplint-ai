import type { AccessibilityNode, AccessibilityTree, LiteAccessibilityTree } from './types.js';
import type { PlainData } from '@markuplint/ml-config';
import type { RuleConfigValue } from '@markuplint/ml-core';

export function toLiteTree<T extends RuleConfigValue, O extends PlainData = undefined>(
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	tree: AccessibilityTree<T, O>,
): LiteAccessibilityTree<T, O> {
	const nodeMap = new Map<number, AccessibilityNode<T, O>>();
	const result: string[] = [];

	if (tree.lang && tree.lang !== 'en') {
		result.push(`[lang:${tree.lang}]`);
	}

	walk(tree.nodes, (node, depth) => {
		const indent = '  '.repeat(depth);
		let content: string;
		if (node.type === 'text') {
			content = `| ${node.text}`;
		} else {
			const props = node.props
				// ?.filter(([key]) => !(node.role === 'heading' && key === 'level'))
				?.map(([key, value]) => `${key}="${value}"`)
				.join(' ');
			const propsStr = props ? `(${props})` : '';
			const nameStr = node.name ? `=${node.name}` : '';
			content = `${node.role}${propsStr}${nameStr}`;
		}
		const index = result.push(`${indent}${content}`);
		nodeMap.set(index - 1, node);
	});

	return {
		nodeMap,
		tree: result,
	};
}

function walk<T extends RuleConfigValue, O extends PlainData = undefined>(
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	nodes: readonly AccessibilityNode<T, O>[],
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	callback: (node: AccessibilityNode<T, O>, depth: number) => void,
	depth = 0,
) {
	for (const node of nodes) {
		callback(node, depth);
		if (node.type === 'element' && node.children) {
			walk(node.children, callback, depth + 1);
		}
	}
}
