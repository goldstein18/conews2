'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useEscoopEntries } from './hooks';
import type { EscoopEntry } from '@/types/escoop-entries';

function EscoopEntriesSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'APPROVED':
      return 'bg-green-100 text-green-800';
    case 'DECLINED':
      return 'bg-red-100 text-red-800';
    case 'DELETED':
      return 'bg-gray-100 text-gray-800';
    case 'EXPIRED':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function EscoopEntriesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const { escoopEntries, loading, error } = useEscoopEntries();

  const handleCreateEntry = () => {
    router.push('/dashboard/escoop-entries/create');
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-red-600">
              Error loading escoop entries: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Escoop Entries</h1>
          <p className="text-muted-foreground">
            Manage your event submissions for escoop newsletters
          </p>
        </div>
        <Button onClick={handleCreateEntry} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Entry</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entries List */}
      <Card>
        <CardHeader>
          <CardTitle>Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <EscoopEntriesSkeleton />
          ) : escoopEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                No escoop entries found
              </div>
              <Button onClick={handleCreateEntry} variant="outline">
                Create your first entry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Escoop</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escoopEntries
                  .filter((entry: EscoopEntry) =>
                    !searchTerm ||
                    entry.escoop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    entry.event.title.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((entry: EscoopEntry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{entry.escoop.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {entry.escoop.status} • {entry.escoop.remaining} remaining
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{entry.event.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/escoop-entries/${entry.id}/edit`)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}