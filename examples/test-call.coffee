{LazyEvaluator, LE} = require '..'
fs = require 'fs'

le = LazyEvaluator.buildFromAst [
		'Program',
			['Show', '====CallSync']
			['Show', ['CallSync', ['Get', 'double'], 2]]
			['Show', '====Sleeping 2 seconds']
			['Call', ['Get', 'sleep'], 2]


			['Show', '====Reading source file of this example']
			['Show'
				['Set', 'res', ['Call'
					['Get', 'readFile']
					['Get', 'source']
				]]
			]
			['If'
				['IsError', ['Get', 'res']]
				['Show', 'Error reading file']
				['Show', 'Reading file successfull']
			]



			['Show', '====Calling function that throws an exception']
			['Show', ['Set', 'res', ['CallSync', ['Get', 'syncError']]]]
			['If'
				['IsError', ['Get', 'res']]
				['Show', 'Error calling function']
				['Show', 'Calling function successfull']
			]

	]

le.context.double = (a)->2*a

le.context.sleep = (s, callback)-> setTimeout callback, s * 1000

le.context.readFile = (filename, callback)-> 
	fs.readFile filename, 'utf8', (err, data) ->callback err || data

le.context.syncError = (filename)-> 
	throw 'some error'

le.context.source = __filename

le.eval (result)->