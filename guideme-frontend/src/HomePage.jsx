import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">GuideMe LMS</h1>
        <p className="text-gray-600 mb-6">Your step-by-step learning assistant</p>

        {/* Login button using React Router */}
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Login to Continue
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
