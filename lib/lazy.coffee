class LazyEvaluator
	constructor: (@args...)->
		@context = {}
		@currentArg = 0

	contextType : 'global'

	maxArgs: false

	onStart: ->	@nextArg()

	onArg: (pass)-> pass()

	onEnd: -> @return @results

	nextArg: ->
		if @currentArg >= @args.length or (@maxArgs isnt false and @currentArg >= @maxArgs)
			@onEnd()
		else
			arg = @args[@currentArg]
			@currentArg++
			arg.passContext @context #sic!
			arg.eval (result)=>
				@results.push(result)
				@onArg =>@nextArg()				
	
	passContext: (context)->
		if @contextType is 'local'
			Ctx = ()->
			Ctx.prototype = context
			@context = new Ctx
		else
			@context = context
	
	eval: (ret)->
		@return = ret
		@results = []
		@currentArg = 0
		@onStart()

LE = {}
LazyEvaluator.buildFromAst = (ast)->
	if Array.isArray ast
		func = ast.shift()
		if LE[func]?
			result = new LE[func]
			result.args = (LazyEvaluator.buildFromAst arg for arg in ast)
		else
			throw 'shit'
	else
		result = new LE.Constant ast
	
	result

exports.LazyEvaluator = LazyEvaluator
exports.LE = LE
