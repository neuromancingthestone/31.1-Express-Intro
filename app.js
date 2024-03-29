const express = require('express');
const ExpressError = require('./expressError')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function strToNums(strArr) {
    let numArr = [];
    for(let i=0; i<strArr.length; i++) {
        let num = parseInt(strArr[i]);
        if(Number.isNaN(num)) {
            throw new ExpressError(`ERROR! Value ${strArr[i]} at index ${i} is not a valid number.`, 400);
        }
        numArr.push(num);
    }
    return numArr;
}

function getMean(arr) {
    const sum = arr.reduce((acc, curVal) => acc + curVal, 0);
    return sum/arr.length;
}

function getMedian(arr) {
    values = [...arr].sort((a, b) => a - b);
    const half = Math.floor(values.length / 2);

    const median = values.length % 2 
        ? values[half] 
        : (values[half - 1] + values[half]) / 2;
    return median;
}

function getMode(arr) {
    const count = {};

    arr.forEach(e => {
        if(!(e in count)) {
            count[e] = 0;
        }
        count[e]++;
    });

    let mode;
    let bestCount = 0;

    Object.entries(count).forEach(([k,v]) => {
        if(v > bestCount) {
            mode = k;
            bestCount = v;
        }
    });
    
    return mode;
}

app.get('/mean', (req, res, next) => {
    try{
        if(req.query.nums === undefined) throw new ExpressError("Nums are required.", 400)
        const numArr = strToNums(req.query.nums.split(','));       
        const mean = getMean(numArr)
    
        return res.status(201).json({
            operation: 'mean',
            value: mean
        });            
    } catch(e) {
        return next(e);
    }
})

app.get('/median', (req, res, next) => {
    try{
        if(req.query.nums === undefined) throw new ExpressError("Nums are required.", 400)
        const numArr = strToNums(req.query.nums.split(','));
        const median = getMedian(numArr);
        return res.status(201).json({
            operation: 'median',
            value: median
        });    
    } catch(e) {
        return next(e);       
    }
})

app.get('/mode', (req, res, next) => {
    try{
        if(req.query.nums === undefined) throw new ExpressError("Nums are required.", 400)
        const numArr = strToNums(req.query.nums.split(','));
        const mode = getMode(numArr);
    
        return res.status(201).json({
            operation: 'mode',
            value: mode
        });        
    } catch(e) {
        return next(e);         
    }
})

// If no other route matches, respond with a 404
app.use((req, res, next) => {
    const e = new ExpressError("Page Not Found", 404);
    next(e);
});
  
// Error Handler
app.use((err, req, res, next) => {
    // the default status is 500 Internal Server Error
    let status = err.status || 500;
    let message = err.msg;

    // set the status and alert the user
    return res.status(status).json({
        error: {message, status}
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});