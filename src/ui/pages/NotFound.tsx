import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="glass-card h-screen text-white flex justify-center items-center flex-col  gap-4">
      <h2>404</h2>
      <Link className="bg-accent p-4 rounded-2xl" to="/">
        <h6>Home</h6>
      </Link>
    </div>
  );
};

export default NotFound;
