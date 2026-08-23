
import { Metadata } from "next";
import ProfileForm from "./components/form";


export const metadata: Metadata = {
  title: "Profile",
};


const page = async () => {

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>

          <p className="text-sm text-muted-foreground">
            Manage your blog users.
          </p>
        </div>
      </div>
    <div className="w-full max-w-md">
        <ProfileForm />
    </div>
    </div>
  );
};

export default page;
