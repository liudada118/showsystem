export function footLine(wsPointData, flag) {

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 32; j++) {
            [wsPointData[i * 32 + j], wsPointData[(14 - i) * 32 + j]] = [
                wsPointData[(14 - i) * 32 + j],
                wsPointData[i * 32 + j],
            ];
        }
    }

    let b = wsPointData.splice(0, 15 * 32)
    wsPointData = wsPointData.concat(b)

    for (let i = 0; i < 32; i++) {
        for (let j = 0; j < 8; j++) {
            [wsPointData[i * 32 + j], wsPointData[(i) * 32 + 15 - j]] = [
                wsPointData[(i) * 32 + 15 - j],
                wsPointData[i * 32 + j],
            ];
        }
    }

    wsPointData = zeroLine(wsPointData)

    let colArr = [], rowArr = []
    for (let i = 0; i < 32; i++) {
        let coltotal = 0, rowtotal = 0
        for (let j = 0; j < 32; j++) {
            coltotal += wsPointData[j * 32 + i]
            rowtotal += wsPointData[i * 32 + j]
        }
        colArr.push(coltotal)
        rowArr.push(rowtotal)
    }

    if (flag) {
        wsPointData = press(wsPointData)
    }

    let sitData = [],
        backData = [];
    for (let i = 0; i < 32; i++) {
        for (let j = 0; j < 32; j++) {
            if (j < 16) {
                sitData.push(wsPointData[i * 32 + j]);
            } else {
                backData.push(wsPointData[i * 32 + j]);
            }
        }
    }

    return { sitData, backData }

}

export function handLine(arr, flag) {
    let wsPointData = [...arr]
    // let b = wsPointData.splice(0, 17 * 32)
    // wsPointData = wsPointData.concat(b)

    for (let i = 0; i < 32; i++) {
        for (let j = 0; j < 9; j++) {
            [wsPointData[i * 32 + 15 + j], wsPointData[(i) * 32 + 15 + 16 - j]] = [
                wsPointData[(i) * 32 + 15 + 16 - j],
                wsPointData[i * 32 + 15 + j],
            ];
        }
    }

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 32; j++) {
            [wsPointData[i * 32 + j], wsPointData[(15 - i) * 32 + j]] = [
                wsPointData[(15 - i) * 32 + j],
                wsPointData[i * 32 + j],
            ];
        }
    }

    if (flag) {
        wsPointData = press(wsPointData)
    }

    return wsPointData
}

export function zeroLine(arr) {
    let wsPointData = [...arr]
    let colArr = [], rowArr = []
    for (let i = 0; i < 32; i++) {
        let coltotal = 0, rowtotal = 0
        for (let j = 0; j < 32; j++) {
            coltotal += wsPointData[j * 32 + i]
            rowtotal += wsPointData[i * 32 + j]
        }
        colArr.push(coltotal)
        rowArr.push(rowtotal)
    }



    for (let i = 1; i < 31; i++) {
        if (rowArr[i + 1] > 100 && rowArr[i] < 40 && rowArr[i - 1] > 100) {
            for (let j = 0; j < 32; j++) {
                wsPointData[i * 32 + j] = (wsPointData[(i - 1) * 32 + j] + wsPointData[(i + 1) * 32 + j]) / 2
            }
        }
    }

    for (let i = 0; i < 32; i++) {
        if (colArr[i + 1] > 100 && colArr[i] < 40 && colArr[i - 1] > 100) {
            for (let j = 1; j < 31; j++) {
                wsPointData[j * 32 + i] = (wsPointData[(j - 1) * 32 + i] + wsPointData[(j + 1) * 32 + i]) / 2
            }
        }
    }
    return wsPointData
}

// press
function calculateY(x) {
    const coefficient5 = 1.0572246920183572 * Math.pow(10, -10);
    const coefficient4 = -5.855702965038056 * Math.pow(10, -8);
    const coefficient3 = 1.0252295732636972 * Math.pow(10, -5);
    const coefficient2 = 0.00023350459149557124;
    const coefficient1 = -0.01396799876544018;
    const constant = 0.0;

    const y = coefficient5 * Math.pow(x, 5) + coefficient4 * Math.pow(x, 4) + coefficient3 * Math.pow(x, 3) + coefficient2 * Math.pow(x, 2) + coefficient1 * x + constant;

    return y;
}


export function press(arr) {
    let wsPointData = [...arr]

    let colArr = []
    for (let i = 0; i < 32; i++) {
        let total = 0
        for (let j = 0; j < 32; j++) {
            total += wsPointData[j * 32 + i]
        }
        colArr.push(total)
    }
    // //////okok
    for (let i = 0; i < 32; i++) {
        for (let j = 0; j < 32; j++) {
            wsPointData[j * 32 + i] = parseInt((wsPointData[j * 32 + i] / (1245 - colArr[i] == 0 ? 1 : 1245 - colArr[i])) * 1000)
        }
    }
    //////

    // wsPointData = wsPointData.map((a,index) => {return calculateY(a)})
    return wsPointData
}

export function carSitLine(arr) {
    let wsPointData = [...arr]
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 32; j++) {
            [wsPointData[i * 32 + j], wsPointData[(15 - i) * 32 + j]] = [
                wsPointData[(15 - i) * 32 + j],
                wsPointData[i * 32 + j],
            ];
        }
    }

    for (let i = 0; i < 32; i++) {
        for (let j = 0; j < 8; j++) {
            [wsPointData[i * 32 + j + 15], wsPointData[(i) * 32 + 16 - j + 15]] = [
                wsPointData[(i) * 32 + 16 - j + 15],
                wsPointData[i * 32 + j + 15],
            ];
        }
    }
    wsPointData = getLineOk(wsPointData)
    return wsPointData
}

export function carBackLine(arr) {
    let wsPointData = [...arr]
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 32; j++) {
            [wsPointData[i * 32 + j], wsPointData[(15 - i) * 32 + j]] = [
                wsPointData[(15 - i) * 32 + j],
                wsPointData[i * 32 + j],
            ];
        }
    }

    for (let i = 0; i < 32; i++) {
        for (let j = 0; j < 8; j++) {
            [wsPointData[i * 32 + j + 15], wsPointData[(i) * 32 + 16 - j + 15]] = [
                wsPointData[(i) * 32 + 16 - j + 15],
                wsPointData[i * 32 + j + 15],
            ];
        }
    }

    let b = wsPointData.splice(0, 16 * 32)
    // console.log(b,wsPointData)
    wsPointData = wsPointData.concat(b)

    wsPointData = rotateMatrix(wsPointData, 32, 32)
    wsPointData = getLineOk(wsPointData)
    return wsPointData
}


function rotateMatrix(matrix, m, n) {
    const rotatedMatrix = new Array(n);

    for (let i = 0; i < n; i++) {
        rotatedMatrix[i] = new Array(m);
        for (let j = 0; j < m; j++) {
            rotatedMatrix[i][j] = matrix[(m - 1 - j) * n + i];
        }
    }
    const rotatedArray = rotatedMatrix.flat();
    return rotatedArray;
}

function getLineOk(arr) {
    const wsPointData = [...arr]
    // let colArr = [], rowArr = []
    // for (let i = 0; i < 32; i++) {
    //     let coltotal = 0, rowtotal = 0
    //     for (let j = 0; j < 32; j++) {
    //         coltotal += wsPointData[j * 32 + i]
    //         rowtotal += wsPointData[i * 32 + j]
    //     }
    //     colArr.push(coltotal)
    //     rowArr.push(rowtotal)
    // }

    // for (let i = 1; i < 31; i++) {
    //     if (rowArr[i + 1] > 70 && rowArr[i] < 40 && rowArr[i - 1] > 70) {
    //         for (let j = 0; j < 32; j++) {
    //             wsPointData[i * 32 + j] = parseInt((wsPointData[(i - 1) * 32 + j] + wsPointData[(i + 1) * 32 + j])/2)
    //         }
    //     }
    // }

    // for(let i = 0; i < 32; i++){
    //     if (colArr[i + 1] > 70 && colArr[i] < 40 && colArr[i - 1] > 70) {
    //         for (let j = 1; j < 31; j++) {
    //             wsPointData[i * 32 + j] = parseInt((wsPointData[i * 32 + j + 1] + wsPointData[i * 32 + j - 1])/2)
    //         }
    //     }
    // }

    for (let i = 1; i < 31; i++) {
        for (let j = 1; j < 31; j++) {
            if (wsPointData[i * 32 + j] < 10) {
                if (wsPointData[i * 32 + j + 1] > 10 && wsPointData[i * 32 + j - 1] > 10) {
                    wsPointData[i * 32 + j] = parseInt((wsPointData[i * 32 + j + 1] + wsPointData[i * 32 + j - 1]) / 2)
                } else if (wsPointData[(i + 1) * 32 + j] > 10 && wsPointData[(i - 1) * 32 + j] > 10) {
                    wsPointData[i * 32 + j] = parseInt((wsPointData[(i + 1) * 32 + j] + wsPointData[(i - 1) * 32 + j]) / 2)
                }
            }
        }
    }
    return wsPointData
}