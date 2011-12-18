class LazyEvaluator
	constructor: (@args...)->
		@context = {}
		@currentArg = 0

	contextType : 'global'

	maxArgs: false

	onStart:()->
		@nextArg()

	onArg:(pass)->
		pass()

	onEnd:()->
		@return @results

	nextArg: ()->
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
		@onStart ret

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

class LE.Constant extends LazyEvaluator
	onStart: ()->
		@return @args[0]

class LE.Plus extends LazyEvaluator
	onEnd: ()->
		sum = 0
		sum += res for res in @results
		@return sum

class LE.Minus extends LazyEvaluator
	maxArgs: 2
	onEnd: ()->
		@return @results[0] - @results[1]

class LE.Divide extends LazyEvaluator
	maxArgs: 2
	onEnd: ()->
		@return @results[0] / @results[1]

class LE.Multiply extends LazyEvaluator
	onEnd: ()->
		prod = @results[0]
		prod *= res for res in @results[1..]
		@return prod

	onArg: (pass)->
		if @results[@currentArg-1] == 0
			@return 0
		else
			pass()

class LE.Show extends LazyEvaluator
	onEnd: ()->
		console.log.apply console, @results 
		@return null

class LE.Set extends LazyEvaluator
	maxArgs: 2
	onEnd: ()->
		[name, value] = @results
		@context[name] = value
		@return value

class LE.Get extends LazyEvaluator
	maxArgs: 1
	onEnd: ()->
		[name] = @results
		@return @context[name]


class LE.Program extends LazyEvaluator

class LE.Block extends LazyEvaluator
	contextType: 'local'


exports.LazyEvaluator = LazyEvaluator
exports.LE = LE
