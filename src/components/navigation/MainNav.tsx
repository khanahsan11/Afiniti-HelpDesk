//use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/buttons";
// Add this comment above the import to suppress warning:
// eslint-disable-next-line deprecation/deprecation
import {
  HomeIcon,
  UsersIcon,
  LinkIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function MainNav() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <nav className="bg-gray-800 px-4 py-3 shadow-md">
      <div className="flex flex-wrap items-center justify-between">
        {/* Logo/Branding */}
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center text-white hover:text-gray-300"
          >
            <HomeIcon className="h-6 w-6 mr-2" />
            <span className="font-bold">Afiniti HelpDesk</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {!isLoading && (
            <>
              {session ? (
                <>
                  {/* Admin Links */}
                  {session.user.role === "admin" && (
                    <>
                      <Link
                        href="/admin/users"
                        className="flex items-center px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <UsersIcon className="h-5 w-5 mr-2" />
                        Users
                      </Link>
                      <Link
                        href="/admin/webhooks"
                        className="flex items-center px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <LinkIcon className="h-5 w-5 mr-2" />
                        Webhooks
                      </Link>
                      <Link
                        href="/admin/logs"
                        className="flex items-center px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        Logs
                      </Link>
                    </>
                  )}

                  {/* Supervisor Links */}
                  {session.user.role === "supervisor" && (
                    <Link
                      href="/supervisor/coaching"
                      className="flex items-center px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <UsersIcon className="h-5 w-5 mr-2" />
                      Coaching
                    </Link>
                  )}

                  {/* User Profile & Logout */}
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-sm text-gray-300">
                      {session.user.name} ({session.user.role})
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href="/api/auth/signout"
                        className="text-white hover:text-red-300"
                      >
                        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="sm" // Now properly typed
                  asChild
                  className="flex items-center"
                >
                  <Link href="/login">
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                    Login
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
