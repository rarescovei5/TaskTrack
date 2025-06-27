import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from './slices/authApiSlice';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from './slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const [errMsg, setErrMsg] = React.useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) return;

    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...userData }));
      navigate('/');
    } catch (err: any) {
      if (!('response' in err)) {
        setErrMsg('No Server Response');
      }
    }
  };

  return (
    <div className="flex h-svh w-full">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8">
        <div className="max-w-lg w-full mx-auto">
          <h3 className="font-bold mb-4">Welcome Back</h3>
          <p className="text-muted mb-8">
            Sign in to access your dashboard and continue where you left off.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block typography-small font-medium text-muted"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full border border-border rounded-md px-4 py-3 outline-none focus:ring focus:ring-primary"
                placeholder="you@example.com"
                required
                ref={emailRef}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full border border-border rounded-md px-4 py-3 outline-none focus:ring focus:ring-primary"
                placeholder="••••••••"
                required
                ref={passwordRef}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-background font-semibold py-3 px-4 rounded-md transition duration-300 cursor-pointer"
              disabled={isLoading}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Image & Testimonial (hidden on small screens) */}
      <div className="hidden md:flex flex-1 relative">
        <img
          src="https://picsum.photos/1080/1920"
          alt="App preview"
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-3 right-3 bg-background/75 backdrop-blur-md rounded-md shadow-lg px-4 py-3 max-w-xs">
          <small className="italic text-muted block">
            “This app made my workflow so much faster. I can't imagine going back to the
            old way.”
          </small>
          <small className="font-semibold text-foreground mt-2 text-right block">
            — Happy User (probably)
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
