{LazyEvaluator, LE} = require './lazy.coffee'


le = LazyEvaluator.buildFromAst [
		'Program',
			['Show', '====Arithmetics']
			['Show', ['Minus', 2, 6]]
			['Show', ['Plus', 2, 6, 10, 91]]
			['Show', ['Multiply', 2, 6, 10, 7]]
			['Show', ['Divide', 2, 6]]
	]

le.eval (result)->

le2 = LazyEvaluator.buildFromAst [
		'Program'
			['Show', '====Block visibility']
			['Set', 'a', 'foo']
			['Show', ['Get', 'a']]
			['Block' #block with local scope
				['Set', 'a', 'bar']
				['Show', ['Get', 'a']]		
			]
			['Show', ['Get', 'a']]
	]

le2.eval (result)->

le3 = LazyEvaluator.buildFromAst [
		'Program'
			['Show', '====Sleep function']
			['Show', 'Hello']
			['Sleep', 2000]
			['Show', 'World']
	]

le3.eval (result)->

