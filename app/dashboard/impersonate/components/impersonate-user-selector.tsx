"use client";

import { useState } from 'react';
import { Search, User, Building2, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchUsers, UserToImpersonate } from '../hooks/use-search-users';
import { useDebounce } from '@/hooks/use-debounce';

interface ImpersonateUserSelectorProps {
  onUserSelect: (user: UserToImpersonate) => void;
  selectedUserId?: string;
}

export function ImpersonateUserSelector({
  onUserSelect,
  selectedUserId,
}: ImpersonateUserSelectorProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { users, loading, totalCount } = useSearchUsers(debouncedSearch);

  const handleUserClick = (user: UserToImpersonate) => {
    onUserSelect(user);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search User to Impersonate</CardTitle>
        <CardDescription>
          Search by name or email. Only non-admin users can be impersonated.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Users</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Type name or email to search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {search && (
            <p className="text-sm text-muted-foreground">
              {loading ? 'Searching...' : `Found ${totalCount} user${totalCount !== 1 ? 's' : ''}`}
            </p>
          )}
        </div>

        {/* Results */}
        <div className="space-y-2">
          {!search && (
            <div className="text-center py-12 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start typing to search for users</p>
            </div>
          )}

          {search && search.length < 2 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Type at least 2 characters to search</p>
            </div>
          )}

          {loading && search.length >= 2 && (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && search.length >= 2 && users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No users found matching &quot;{search}&quot;</p>
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {users.map((user) => (
                <Card
                  key={user.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
                    selectedUserId === user.id
                      ? 'border-primary bg-accent'
                      : 'border-border'
                  }`}
                  onClick={() => handleUserClick(user)}
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium truncate">
                          {user.firstName} {user.lastName}
                        </h4>
                        <Badge
                          variant={user.isActive ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate">{user.companyName}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Shield className="h-3 w-3" />
                          <span>{user.role?.name || 'No role'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedUserId === user.id && (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
