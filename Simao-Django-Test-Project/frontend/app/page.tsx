import Link from 'next/link';

export default function Home() {
  return (
    <div className="hero min-h-[85vh]">
      <div className="hero-content text-center">
        <div className="max-w-3xl">
          <div className="mb-8">
            <div className="text-6xl mb-4">📋</div>
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Task Manager
            </h1>
            <p className="text-xl text-base-content/80 leading-relaxed mb-8">
              A modern, full-stack task management application built with Django REST Framework and Next.js.
              Organize your tasks efficiently with a clean, intuitive interface and powerful features.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-bold text-lg">Fast & Responsive</h3>
                <p className="text-sm text-base-content/70">Built with Next.js 16 for optimal performance</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-2">🔒</div>
                <h3 className="font-bold text-lg">Secure Authentication</h3>
                <p className="text-sm text-base-content/70">JWT-based auth with Django backend</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-2">🎨</div>
                <h3 className="font-bold text-lg">Beautiful UI</h3>
                <p className="text-sm text-base-content/70">Modern design with Tailwind CSS & DaisyUI</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn btn-primary btn-lg gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              Get Started Free
            </Link>
            <Link href="/login" className="btn btn-outline btn-lg gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
