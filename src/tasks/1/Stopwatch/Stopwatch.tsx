import React, { useState, useEffect, useRef} from "react";

function Stopwatch() {
    const [status, setStatus] = useState(false)
    const [runningTime, setRunningTime] = useState(0)
    const timer = useRef(0)

    function getUnits(time: number) {
        const seconds = time / 1000;

        const min = Math.floor(seconds / 60).toString();
        const sec = Math.floor(seconds % 60).toString();
        const msec = (seconds % 1).toFixed(3).substring(2);

        return `${min}:${sec}:${msec}`;
    }

    const handleClick = () => {
        if (status) {
            clearInterval(timer.current);
        } else {
            const startTime = Date.now() - runningTime;
            timer.current = setInterval(() => {
                setRunningTime(Date.now() - startTime)
            });
        }
        setStatus(s => !s)
    };

    const handleReset = () => {
        clearInterval(timer.current);
        setRunningTime(0)
        setStatus(false)
    };

    const handleLap = () => {
        console.log(getUnits(runningTime));
    };

    useEffect(() => {
        return () => {
            clearInterval(timer.current)
            console.log('componentWillUnmount')
        };
    }, [])

    // leftPad = (width, n) => {
    //     if ((n + '').length > width) {
    //         return n;
    //     }
    //     const padding = new Array(width).join('0');
    //     return (padding + n).slice(-width);
    // };


    return (
        <div>
            <p>{getUnits(runningTime)}</p>
            <button onClick={handleClick}>
                {status ? "Stop" : "Start"}
            </button>
            <button onClick={handleReset}>Reset</button>
            <button onClick={handleLap}>Lap</button>
        </div>
    );
}

export default Stopwatch;
