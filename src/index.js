function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    
    let tempArr = [];
    let stack = [];
    let outStr = [];
    let result = [];

    const rangeOperation = {
        '*': 3,
        '/': 3,
        '+': 2,
        '-': 2,
        '(': 1,
        ')': 1
    }

    const operators = {
        '*': (x, y) => x * y,
        '/': (x, y) => { 
            if(x === 0 || y === 0) {
                throw("TypeError: Division by zero.")
            }
            return x / y
        },
        '+': (x, y) => x + y,
        '-': (x, y) => x - y
    };

    // tempArr = expr.match(/[^\s|\"]+/g);
    tempArr = expr.match(/\(|\)|\d+|[\+,\-,\*,\/]/g);

    for(let i = 0; i < tempArr.length; i++){
        // debugger
        if(tempArr.length) { 
            let token = tempArr[i];              
            if(token in rangeOperation) {
                if(stack.length) {
                    if(token === ')') {
                        let flag = stack.some(stackItem => {
                            return stackItem === '(';
                        })

                        if(flag) {
                            for(let i = stack.length - 1; i >= 0; i--) {
                                if(stack[i] !== "(" && stack.length > 0) {
                                    outStr.push(stack.pop(stack[i]))
                                } else if(stack[i] === '(') {
                                    stack.pop(stack[i]);
                                    break;
                                }
                            }
                        } else {
                            throw("ExpressionError: Brackets must be paired");
                        }
                    } else if(token === '(') {
                        stack.push(token);
                    } else {
                        if (rangeOperation[token] > rangeOperation[stack[stack.length - 1]]) {
                            stack.push(token);
                        } else if(rangeOperation[token] === rangeOperation[stack[stack.length - 1]]) {
                            outStr.push(stack.pop(stack[stack.length - 1]));
                            stack.push(token);
                        } else {
                            while(rangeOperation[token] <= rangeOperation[stack[stack.length - 1]]) {
                                outStr.push(stack.pop(stack[stack.length - 1]));
                            }
                            stack.push(token);
                        }  
                    }    
                } else {
                    stack.push(token);
                }
            } else {
                outStr.push(parseInt(token));
            }
        }
    }
    // debugger
    while(stack.length) {
        stack.forEach((token) => {
            if(token === '(') {
                throw("ExpressionError: Brackets must be paired");
            } else {
                outStr.push(stack.pop(token));
            }    
        })
    }

    outStr.map((token) => {
        if (token in operators) {
            let [x, y] = [result.splice(result.length - 2, 1).join(), result.splice(result.length - 1, 1).join()];
            result.push(operators[token](parseFloat(x), parseFloat(y)));
        } else {
            result.push(token);
        }
    });
    
    return result.pop();
};

module.exports = {
    expressionCalculator
}
