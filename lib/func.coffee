{LazyEvaluator, LE} = require './lazy.coffee'


###
Call synchronous external function
###
class LE.CallSync extends LazyEvaluator
    onEnd: ->
        [func, funcArgs...] = @results
        res = (
            try
                func.apply(@, funcArgs)
            catch e
                if typeof e is 'string'
                    new Error e
                else
                    e
        )
        @return res

###
Call asynchronous external function
###
class LE.Call extends LazyEvaluator
    onEnd: ->
        [func, funcArgs...] = @results
        funcArgs.push @return
        try
            func.apply(@, funcArgs)
        catch e
            if typeof e is 'string'
                @return new Error e
            else
                @return e
