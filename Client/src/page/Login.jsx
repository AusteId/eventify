const Login = () => {
  return (
    <div className="desktop:w-112 tablet:w-112 mx-auto px-6 pt-12 pb-12">
      <div className="bg-[#FFFFFF] w-full h-auto rounded-2xl shadow-md">
        <div className="text-center px-8 pt-8 pb-8">
          <h1 className="text-header-dark font-inter text-heading-m font-bold">
            Welcome Back!
          </h1>
          <p className="font-inter text-body-medium pt-1">
            Please enter your credentials to continue
          </p>
        </div>
        <form action="" className="px-8">
          <label class="block font-inter text-body-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="h-12 appearance-none border border-input-light rounded-lg w-full py-2 px-3 mb-6 text-body-medium leading-tight focus:outline-none"
            id="email"
            type="email"
            placeholder="your@email.com"
          />
          <label
            class="block font-inter text-body-medium mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="h-12 appearance-none border border-input-light rounded-lg w-full py-2 px-3 mb-6 text-body-medium leading-tight focus:outline-none"
            id="password"
            type="password"
            placeholder="••••••••"
          />
          <div className="flex items-center mb-6">
            <input
              id="remember-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 rounded-sm checkbox border-body-medium shadow-none text-body-medium"
            />
            <label
              className="font-inter text-body-medium ml-2"
              htmlFor="remember-checkbox"
            >
              Remember me
            </label>
          </div>
          <button className="btn bg-btn w-full h-12 border-0 shadow-none hover:bg-btn-hover px-4 pt-2 pb-2 rounded-lg">
            Sign In
          </button>
        </form>
        <div className="w-full text-center pt-6 pb-8">
          <p className="font-inter text-body-medium">
            Don't have an account?{' '}
            <a className="text-btn-hover" href="/register">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
