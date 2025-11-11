'use client';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();

  const goHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
      <p className="text-xl mb-6 text-gray-600">Page Not Found</p>
      <button
        onClick={goHome}
        className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      >
        Go back to Home
      </button>
    </div>
  );
};

export default NotFound;