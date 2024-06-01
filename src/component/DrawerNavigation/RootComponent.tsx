import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../GoogleLogin/Login';
import App from '../../App';

const RootComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<App />} />
        {/* 其他路由设置 */}
      </Routes>
    </Router>
  );
};

export default RootComponent;
