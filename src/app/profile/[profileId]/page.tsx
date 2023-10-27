import React from "react";

function UserProfile({ params }: any) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <p className="text-4xl">Profle page {params.profileId}</p>
    </div>
  );
}

export default UserProfile;
