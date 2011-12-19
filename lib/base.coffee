{LazyEvaluator, LE} = require './lazy.coffee'

class LE.Constant extends LazyEvaluator
    onStart: -> @return @args[0]

class LE.Set extends LazyEvaluator
    maxArgs: 2
    onEnd: ->
        [name, value] = @results
        @context[name] = value
        @return value

class LE.Get extends LazyEvaluator
    maxArgs: 1
    onEnd: ->
        [name] = @results
        @return @context[name]

class LE.Program extends LazyEvaluator

class LE.Block extends LazyEvaluator
    contextType: 'local'

class LE.Group extends LazyEvaluator
    contextType: 'global'
