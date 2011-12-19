{LazyEvaluator, LE} = require './lazy.coffee'

class LE.Plus extends LazyEvaluator
    onEnd: ()->
        sum = 0
        sum += res for res in @results
        @return sum

class LE.Minus extends LazyEvaluator
    maxArgs: 2
    onEnd: -> @return @results[0] - @results[1]

class LE.Divide extends LazyEvaluator
    maxArgs: 2
    onEnd: -> @return @results[0] / @results[1]

class LE.Multiply extends LazyEvaluator
    onEnd: ->
        prod = @results[0]
        prod *= res for res in @results[1..]
        @return prod

    onArg: (pass)->
        if @results[@currentArg-1] == 0
            @return 0
        else
            pass()

class LE.Gt extends LazyEvaluator
    maxArgs: 2
    onEnd: -> @return @results[0] > @results[1]

class LE.Ge extends LazyEvaluator
    maxArgs: 2
    onEnd: -> @return @results[0] >= @results[1]

class LE.Lt extends LazyEvaluator
    maxArgs: 2
    onEnd: -> @return @results[0] < @results[1]

class LE.Le extends LazyEvaluator
    maxArgs: 2
    onEnd: -> @return @results[0] <= @results[1]

class LE.Not extends LazyEvaluator
    maxArgs: 1
    onEnd: -> @return !@results[0]
