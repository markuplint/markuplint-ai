import { createPlugin } from '@markuplint/ml-core';

import { ruleSemantic } from './rules/rule-semantic.js';

export default createPlugin({
	name: 'markuplint-ai',
	create() {
		return {
			rules: {
				'rule-semantic': ruleSemantic(),
			},
		};
	},
});
