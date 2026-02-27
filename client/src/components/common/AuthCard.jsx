const AuthCard = ({ children, title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default AuthCard;