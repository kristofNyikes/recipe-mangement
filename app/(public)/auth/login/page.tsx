import SignUpForm from "@/app/Components/Forms/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-28">
      <h1 className="text-3xl">Welcome back!</h1>
      <SignUpForm />
    </div>
  );
};

export default LoginPage;
