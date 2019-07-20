const getDiff = (orig, target) => {
    const backTrace = (trace) => {
        let x = orig.length;
        let y = target.length;
        const changeHistory = [];
        changeHistory.push([x, y]);
        for (let i = trace.length - 1; i >= 0; i--) {
            const bound = trace[i].bound;

            const k = x - y;
            let prev_k;
            if (k === bound.lowerBound) {
                prev_k = k + 1;
            } else if (k === bound.upperBound) {
                prev_k = k - 1;
            } else {
                prev_k = trace[i].v[k + 1] > trace[i].v[k - 1] ? k + 1 : k - 1;
            }
            const prev_x = trace[i].v[prev_k];
            const prev_y = prev_x - prev_k;
            while (x > prev_x && y > prev_y) {
                x--;
                y--;
                changeHistory.push([x, y]);
            }

            x = prev_x;
            y = prev_y;
            changeHistory.push([x, y]);
        }
        return changeHistory.reverse();
    };

    //deep clone the array, note that since a negative index of an array in Javascript is not a part of the array.
    const arrCopy = (arr, lowerBound, upperBound) => {
        const copy = {};
        for (let i = lowerBound; i <= upperBound; i++) {
            copy[i] = arr[i];
        }
        return copy;
    };

    const col = orig.length;
    const row = target.length;

    const maxDepth = col + row; //max edit times
    const editGraph = [];
    editGraph[1] = 0;  //initialize the value for the first iteration in the loop below

    let reachBottom = false;
    let reachRight = false;
    let lowerBound = 0;
    let upperBound = 0;

    let trace = [];

    for (let d = 0; d <= maxDepth; d++) {
        lowerBound = !reachBottom ? -d : lowerBound + 1;
        upperBound = !reachRight ? d : upperBound - 1;
        let x;
        for (let k = lowerBound; k <= upperBound; k += 2) {
            if (k === lowerBound) {
                x = editGraph[k + 1];
            } else if (k === upperBound) {
                x = editGraph[k - 1] + 1;
            } else {
                x = editGraph[k - 1] >= editGraph[k + 1] ? editGraph[k - 1] + 1 : editGraph[k + 1]
            }

            let y = x - k;

            //check if there is a diagonal line starting from (x, y). If so, go further.
            while (x < col && y < row && orig.charAt(x) === target.charAt(y)) {
                x += 1;
                y += 1;
            }
            editGraph[k] = x;

            if (y === row) {
                reachBottom = true;
            }
            if (x === col) {
                reachRight = true;
            }

            //reach the right-bottom corner of the edit graph
            if (x === col && y === row) {
                console.log("max edit depth:", d);
                return backTrace(trace);
            }
        }
        trace.push({
            v: arrCopy(editGraph, lowerBound, upperBound),
            bound: {
                lowerBound: lowerBound,
                upperBound: upperBound,
            }
        })
    }
};

const printDiff = (changeHistory, orig, target) => {
    for (let i = 1; i < changeHistory.length; i++) {
        const prev_x = changeHistory[i - 1][0];
        const prev_y = changeHistory[i - 1][1];
        const curr_x = changeHistory[i][0];
        const curr_y = changeHistory[i][1];

        // only x coordinate increases ==> rightward move ==> delete a character in the original string
        // only y coordinate increases ==> downward move ==> add a character in the target string
        // both coordinates increase ==> diagonal move ==> the character in the original and target string is the same
        if (curr_x > prev_x && curr_y > prev_y) {
            console.log('%c == ' + orig.charAt(prev_x), 'color: #000000');
        } else if (curr_x > prev_x) {
            console.log('%c -- ' + orig.charAt(prev_x), 'color: #DC143C');
        } else if (curr_y > prev_y) {
            console.log('%c ++ ' + target.charAt(prev_y), 'color: #66CC00');
        }
    }
};

//test
(() => {
    const orig = "ABCABBA";
    const target = "CBABAC";

    let changeHistory = getDiff(orig, target);
    printDiff(changeHistory, orig, target)
})();

