{LazyEvaluator, LE} = require './lazy.coffee'


le = LazyEvaluator.buildFromAst [
		'Program',
			['Show', '====While']
			['Set', 'A', 0]
			['While', ['Lt', ['Get', 'A'], 100]
				['Group', 
					['Show', ['Get', 'A']]
					['Set', 'A', ['Plus', 1, ['Get', 'A']]]
				]
			]
	]

le.eval (result)->

