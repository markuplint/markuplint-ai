import type { AccessibilityElement, AccessibilityNode, AccessibilityTree } from './types.js';
import type { PlainData } from '@markuplint/ml-config';
import type { Document, RuleConfigValue } from '@markuplint/ml-core';
import type { ARIAVersion } from '@markuplint/ml-spec';
import type { Writable } from 'type-fest';

type NodeList<T extends RuleConfigValue, O extends PlainData = undefined> = Document<T, O>['childNodes'];

const transparentRoles = new Set(['presentation', 'none', 'generic']);

export function fromDocument<T extends RuleConfigValue, O extends PlainData = undefined>(
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	document: Document<T, O>,
	ariaVersion: ARIAVersion = '1.2',
): AccessibilityTree<T, O> {
	const title = document.querySelector('title')?.textContent.trim() ?? '';
	const lang = document.querySelector('html')?.getAttribute('lang') ?? null;
	const childNodes = document.querySelector('body')?.childNodes ?? document.childNodes;
	const nodes = recursiveConvertAOM(childNodes, lang, ariaVersion);

	return {
		title,
		lang,
		nodes,
	};
}

function recursiveConvertAOM<T extends RuleConfigValue, O extends PlainData = undefined>(
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	nodes: NodeList<T, O>,
	lang: string | null,
	ariaVersion: ARIAVersion,
): AccessibilityNode<T, O>[] {
	// eslint-disable-next-line unicorn/prefer-spread
	return Array.from(nodes).flatMap(node => {
		if (node.is(node.TEXT_NODE)) {
			const text = node.textContent?.trim();

			if (!text) {
				return [];
			}

			return {
				type: 'text',
				host: node,
				text,
				startOffset: node.startOffset,
				startLine: node.startLine,
				startCol: node.startCol,
			};
		}

		lang = node.is(node.ELEMENT_NODE) ? node.getAttribute('lang') ?? lang : lang;

		const aom = node.ownerMLDocument.getAccessibilityProp(node, ariaVersion);

		if (
			!aom ||
			aom.unknown ||
			!aom.exposedToTree ||
			!aom.role ||
			transparentRoles.has(aom.role) ||
			!node.is(node.ELEMENT_NODE)
		) {
			return recursiveConvertAOM(node.childNodes, lang, ariaVersion);
		}

		const name = aom.nameProhibited ? null : typeof aom.name === 'string' ? aom.name : aom.nameRequired ? '' : null;

		const aNode: Writable<AccessibilityElement<T, O>> = {
			type: 'element',
			host: node,
			role: aom.role,
			name,
			description: null,
			focusable: !!aom.focusable,
			lang,
		};

		const aomProps = Object.entries(aom.props ?? {});
		if (aomProps.length > 0) {
			aNode.props = aomProps
				.map(([key, value]) => (value.value ? [key, value.value] : null))
				.filter((value): value is [string, string] => !!value);
		}

		if (node.childNodes.length > 0) {
			const children = recursiveConvertAOM(node.childNodes, lang, ariaVersion);
			const mergedChildren: AccessibilityNode<T, O>[] = [];
			for (const child of children) {
				const lastChild = mergedChildren.pop();
				if (!lastChild) {
					mergedChildren.push(child);
					continue;
				}
				if (lastChild.type === 'text' && child.type === 'text') {
					mergedChildren.push({
						...lastChild,
						text: lastChild.text + child.text,
					});
					continue;
				}
				mergedChildren.push(lastChild, child);
			}
			if (
				!(
					mergedChildren.length === 1 &&
					mergedChildren[0]?.type === 'text' &&
					mergedChildren[0].text === aNode.name
				)
			) {
				aNode.children = mergedChildren;
			}
		}

		return aNode;
	});
}
