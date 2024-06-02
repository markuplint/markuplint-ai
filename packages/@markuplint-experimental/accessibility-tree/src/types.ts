import type { PlainData } from '@markuplint/ml-config';
import type { Element, Text, ChildNode, RuleConfigValue } from '@markuplint/ml-core';

export interface AccessibilityTree<T extends RuleConfigValue, O extends PlainData = undefined> {
	readonly url?: string;
	readonly title: string;
	readonly lang: string | null;
	readonly nodes: readonly AccessibilityNode<T, O>[];
}

export type AccessibilityNode<T extends RuleConfigValue, O extends PlainData = undefined> =
	| AccessibilityElement<T, O>
	| TextNode<T, O>;

interface AbstractNode<T extends RuleConfigValue, O extends PlainData = undefined> {
	readonly type: 'element' | 'text';
	readonly host: ChildNode<T, O>;
}

export interface AccessibilityElement<T extends RuleConfigValue, O extends PlainData = undefined>
	extends AbstractNode<T, O> {
	readonly type: 'element';
	readonly host: Element<T, O>;
	readonly role: string;
	readonly name: string | null;
	readonly description: string | null;
	readonly focusable: boolean;
	readonly props?: readonly (readonly [string, string])[];
	readonly children?: readonly AccessibilityNode<T, O>[];
	readonly lang: string | null;
}

interface TextNode<T extends RuleConfigValue, O extends PlainData = undefined> extends AbstractNode<T, O> {
	readonly type: 'text';
	readonly host: Text<T, O>;
	readonly text: string;
}

export interface LiteAccessibilityTree<T extends RuleConfigValue, O extends PlainData = undefined> {
	readonly nodeMap: ReadonlyMap<number, AccessibilityNode<T, O>>;
	readonly tree: readonly string[];
}
