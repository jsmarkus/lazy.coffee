{LazyEvaluator, LE} = require './lazy.coffee'


le = LazyEvaluator.buildFromAst [
		'Program',
			['Show', ['Minus', 2, 6]]
			['Show', ['Plus', 2, 6, 10, 91]]
			['Show', ['Multiply', 2, 6, 10, 7]]
			['Show', ['Divide', 2, 6]]
	]

le.eval (result)->
