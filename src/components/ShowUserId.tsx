import { useUser } from '@clerk/clerk-react';

export const ShowUserId = () => {
  const { user } = useUser();
  
  if (!user) return <div>Not logged in</div>;
  
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-bold">Your User Information:</h3>
      <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
      <p><strong>User ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{user.id}</code></p>
    </div>
  );
};