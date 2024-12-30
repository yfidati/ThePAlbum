import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="bg-gray-100 p-4 shadow">
      <div className="container mx-auto">
        <Link to="/" className="text-lg font-bold text-blue-500">
          PHOTOTHEQUE
        </Link>
      </div>
    </nav>
  );
}
