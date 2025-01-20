import { UserButton } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const Navbar = async () => {
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in');
    }

    let stores = [];
    try {
        stores = await db.store.findMany({
            where: {
                userId: user.id,
            },
        });
    } catch (error) {
        console.error("Error fetching stores:", error);
        redirect("/error");
    }

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={stores} />
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
