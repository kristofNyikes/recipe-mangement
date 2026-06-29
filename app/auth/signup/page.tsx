import SignUpForm from "@/app/Components/Forms/SignUpForm";

const SignupPage = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-28">
      <h1 className="text-3xl">Create an account</h1>
      <SignUpForm />
    </div>
  );
};

export default SignupPage;
