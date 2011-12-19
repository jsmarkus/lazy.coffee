{LazyEvaluator, LE} = require '..'

le = LazyEvaluator.buildFromAst [
		'Program',
			['Show', '====If']
			['If', 0
				['Show', 'first then']
			]
			['If', 0
				['Show', 'second then']
				['Show', 'second else']
			]
			['If', 1
				['Show', 'third then']
				['Show', 'third else']
			]
	]

le.eval (result)->

