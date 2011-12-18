{LazyEvaluator, LE} = require './lazy.coffee'


# le = LazyEvaluator.buildFromAst [
# 		'Program',
# 			['Show', ['Minus', 2, 6]]
# 			['Show', ['Plus', 2, 6, 10, 91]]
# 			['Show', ['Multiply', 2, 6, 10, 7]]
# 			['Show', ['Divide', 2, 6]]
# 	]

# le.eval (result)->

le2 = LazyEvaluator.buildFromAst [
		'Program'
			['Set', 'a', 'foo']
			['Show', ['Get', 'a']]
			['Block' #block with local scope
				['Set', 'a', 'bar']
				['Show', ['Get', 'a']]		
			]
			['Show', ['Get', 'a']]
	]

le2.eval (result)->
