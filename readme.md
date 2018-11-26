[Trivia Manager Repository](https://github.com/demitchell14/TriviaGameHandler)

[Socket.IO Examples](https://socket.io/get-started/chat/)


    /**
    * Deep diff between two object, using lodash
    * @param  {Object} object Object compared
    * @param  {Object} base   Object to compare with
    * @return {Object}        Return a new object who represent the diff
    */
    function difference(object, base) {
        function changes(object, base) {
            return _.transform(object, function(result, value, key) {
                if (!_.isEqual(value, base[key])) {
                    result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
                }
            });
        }
        return changes(object, base);
    }
    


Find instances of console.log without console.`(?<!console\.)log\((.*)\)`

Find instance of console.log `console\.log\((.*)\)`