import Link from 'next/link';

export default function Home() {
  return (
    <div className="hero min-h-[80vh]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Task Manager</h1>
          <p className="py-6">
            A modern task management application built with Django and Next.js.
            Organize your tasks efficiently with a clean and intuitive interface.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link href="/login" className="btn btn-outline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
