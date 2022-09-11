import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Landing from './pages/Landing';

const App = () => {
    return (
        <div className="App" style={{ display: 'flex', height: '100vh', padding: '40px', boxSizing: 'border-box' }}>
            <Routes>
                <Route path="/" element={<Landing/>}/>
                <Route path="/home" element={<Home/>}/>
            </Routes>
        </div>
    );
}

export default App;
