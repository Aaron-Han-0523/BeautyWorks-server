function checkLength(target, min_len=1, max_len=400) {
    return (min_len <= target.length) && (target.length <= max_len);
}

function checkSpecialChar(target, min_count = 1) {
    const SC = [..."~!@#$%^&*()_+-="];
    // console.log(SC)
    
    let count = 0;
    for (let i = 0; i < SC.length; i++) {
        if (target.indexOf(SC[i]) != -1) {
            count += 1;
        }
        if (count >= min_count) return true;
    }
    return false;
}

// module.exports = { checkLength: checkLength, checkSpecialChar: checkSpecialChar }