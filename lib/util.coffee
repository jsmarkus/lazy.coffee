{LazyEvaluator, LE} = require './lazy.coffee'

class LE.IsError extends LazyEvaluator
    maxArgs : 1
    onEnd: ->
        @return @results[0] instanceof Error

class LE.Show extends LazyEvaluator
    onEnd: ->
        console.log.apply console, @results 
        @return null


class LE.Sleep extends LazyEvaluator
    maxArgs: 1
    onEnd: -> setTimeout (()=>@return null), @results[0]

