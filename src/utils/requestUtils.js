const sleep = m => new Promise(r => setTimeout(r, m))

const poll = async (fn, params, timeout, interval) => {
    var endTime = Number(new Date()) + (timeout || 2000)
    interval = interval || 100

    var checkCondition = async (params) => {
        var result = await fn(...params)

        if (result) {
            return result
        } else if (Number(new Date()) < endTime) {
            await sleep(interval)
            return checkCondition(params)
        } else {
            throw new Error('Timed out for ' + fn)
        }
    }

    return await checkCondition(params)
}

module.exports = poll