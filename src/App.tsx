import React, {useState} from "react";
import Stopwatch from "src/tasks/1/Stopwatch";
import CommentsList from "./tasks/2/CommentsList";

function App() {
    const [isVisibleTimer, setVisibleTimer] = useState(false)
    return (
        <div className="App">
            <button onClick={() => setVisibleTimer(v => !v)}>{isVisibleTimer ? 'Hide' : 'Show'} timer</button>
            {isVisibleTimer && <Stopwatch />}
            <CommentsList/>
        </div>
    );
}

export default App;
