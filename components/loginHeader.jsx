import { useSession } from 'next-auth/react';

function LoginHeader() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="text-blue-900 flex justify-between">
      <h2>
        <div className="flex gap-2 items-center">
          <img src={session.user.image} alt="" className="w-6 h-6 rounded-md sm:hidden" />
          <div>
            Hello, <b>{session.user.name}</b>
          </div>
        </div>
      </h2>
      <div className="hidden sm:block flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
        <img src={session.user.image} alt="" className="w-6 h-6" />
        <span className="px-2">{session.user.name}</span>
      </div>
    </div>
  );
}

export default LoginHeader;

