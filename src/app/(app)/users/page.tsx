"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ShieldAlert, Users, ChevronLeft, ChevronRight, ChevronsLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { usersApi } from "@/lib/api/users";
import { ROLE_LABELS, type UserRole } from "@/types/auth";
import type { UserDto } from "@/types/user";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ChangeRoleDialog({
  user,
  onUpdateRole,
  isUpdating,
}: {
  user: UserDto;
  onUpdateRole: (userId: string, role: string) => void;
  isUpdating: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRole(user.id, selectedRole);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="h-8" />}>
        {ROLE_LABELS[user.role as UserRole] || user.role}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the access level for {user.email}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <Select
              value={selectedRole}
              onValueChange={(val) => setSelectedRole(val as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ROLE_LABELS).map(([roleKey, label]) => (
                  <SelectItem key={roleKey} value={roleKey}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating || selectedRole === user.role}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function UsersPage() {
  const { hasRole, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const size = 10;

  // Fetch users query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-users", page, size],
    queryFn: () => usersApi.getUsers(page, size),
    enabled: hasRole("ADMIN"),
  });

  // Mutation for updating role
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      usersApi.updateRole(userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(`Role successfully updated to ${ROLE_LABELS[variables.role as UserRole] || variables.role}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user role");
    }
  });

  if (authLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Role Protection (404 / Unauthorized)
  if (!hasRole("ADMIN")) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
        <div className="p-6 bg-destructive/10 rounded-full">
          <ShieldAlert className="w-16 h-16 text-destructive" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">403 - Forbidden</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            You do not have administrator privileges to view this page.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  const users = data?.users || [];
  const totalElements = data?.totalElements || -1; 
  // If backend returns -1, we assume there's more if users.length === size
  const hasMore = totalElements > 0 ? page * size < totalElements : users.length === size;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-8 h-8" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage user access levels and assign roles across the platform.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Users</CardTitle>
          <CardDescription>
            List of all authenticated users from the identity provider.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined At</TableHead>
                  <TableHead>Last Sign-In</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-[120px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    </TableRow>
                  ))
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-destructive">
                      Failed to load users. Ensure the backend is running and configured correctly.
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user: UserDto) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        <ChangeRoleDialog
                          user={user}
                          onUpdateRole={handleRoleChange}
                          isUpdating={updateRoleMutation.isPending && updateRoleMutation.variables?.userId === user.id}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy HH:mm") : "N/A"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.lastSignInAt ? format(new Date(user.lastSignInAt), "MMM d, yyyy HH:mm") : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-muted-foreground">
              Showing page {page}
              {totalElements > 0 && ` of ${Math.ceil(totalElements / size)}`}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(1)}
                disabled={page === 1 || isLoading}
                className="w-8 h-8 p-0"
                title="First Page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="w-8 h-8 p-0"
                title="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore || isLoading}
                className="w-8 h-8 p-0"
                title="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
