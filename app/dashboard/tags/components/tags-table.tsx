"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortableTableHeader, NonSortableTableHeader } from "@/components/ui/sortable-table-header";
import { Tag, TagType } from "@/types/tags";
import { TagSortField, TagSortDirection } from "../hooks";
import { TOGGLE_TAG_STATUS, REMOVE_TAG } from "@/lib/graphql/tags";
import { Edit, Trash2, Power } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
const TAG_TYPE_LABELS: Record<TagType, string> = {
  [TagType.MAIN_GENRE]: 'Main Genre',
  [TagType.SUBGENRE]: 'Sub Genre', 
  [TagType.SUPPORTING]: 'Supporting',
  [TagType.AUDIENCE]: 'Audience'
};

const TAG_TYPE_COLORS: Record<TagType, string> = {
  [TagType.MAIN_GENRE]: 'bg-purple-100 text-purple-800',
  [TagType.SUBGENRE]: 'bg-blue-100 text-blue-800', 
  [TagType.SUPPORTING]: 'bg-green-100 text-green-800',
  [TagType.AUDIENCE]: 'bg-orange-100 text-orange-800'
};

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
  totalCount?: number;
}

interface TagsTableProps {
  tags: Tag[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  sortField: TagSortField;
  sortDirection: TagSortDirection;
  pageInfo?: PageInfo;
  onSort: (field: TagSortField) => void;
  onPreviousPage: () => void;  
  onNextPage: (endCursor?: string) => void;
  onRefetch: () => void;
}

export function TagsTable({
  tags,
  loading,
  error,
  totalCount,
  sortField,
  sortDirection,
  pageInfo,
  onSort,
  onPreviousPage,
  onNextPage,
  onRefetch,
}: TagsTableProps) {
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [modalType, setModalType] = useState<'toggle' | 'delete' | null>(null);
  
  const [toggleTagStatus, { loading: toggleLoading }] = useMutation(TOGGLE_TAG_STATUS, {
    onCompleted: () => {
      toast.success('Tag status updated successfully');
      onRefetch();
    },
    onError: (error) => {
      toast.error(`Failed to update tag status: ${error.message}`);
    },
  });

  const [removeTag, { loading: removeLoading }] = useMutation(REMOVE_TAG, {
    onCompleted: () => {
      toast.success('Tag deleted successfully');
      onRefetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete tag: ${error.message}`);
    },
  });

  const handleStatusToggle = (tag: Tag) => {
    setSelectedTag(tag);
    setModalType('toggle');
  };

  const handleDelete = (tag: Tag) => {
    setSelectedTag(tag);
    setModalType('delete');
  };

  const handleConfirmStatusToggle = async () => {
    if (!selectedTag) return;
    
    try {
      await toggleTagStatus({
        variables: {
          id: selectedTag.id,
          isActive: !selectedTag.isActive,
        },
      });
    } finally {
      closeModal();
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTag) return;
    
    try {
      await removeTag({
        variables: {
          id: selectedTag.id,
        },
      });
    } finally {
      closeModal();
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedTag(null);
  };

  const getTagTypeColor = (type: TagType) => {
    return TAG_TYPE_COLORS[type] || 'bg-gray-100 text-gray-800';
  };

  const renderTagColor = (color?: string) => {
    if (!color) return null;
    return (
      <div 
        className="w-4 h-4 rounded-full border border-gray-300" 
        style={{ backgroundColor: color }}
        title={`Color: ${color}`}
      />
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Tags ({totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading tags...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <p className="text-destructive">Error loading tags: {error.message}</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableTableHeader
                    sortField="name"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={onSort}
                  >
                    Name
                  </SortableTableHeader>
                  <SortableTableHeader
                    sortField="display"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={onSort}
                  >
                    Display
                  </SortableTableHeader>
                  <SortableTableHeader
                    sortField="type"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={onSort}
                  >
                    Type
                  </SortableTableHeader>
                  <NonSortableTableHeader>
                    Main Genre
                  </NonSortableTableHeader>
                  <NonSortableTableHeader>
                    Color
                  </NonSortableTableHeader>
                  <SortableTableHeader
                    sortField="order"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={onSort}
                  >
                    Order
                  </SortableTableHeader>
                  <NonSortableTableHeader>
                    Status
                  </NonSortableTableHeader>
                  <NonSortableTableHeader className="text-right">
                    Actions
                  </NonSortableTableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      <div className="font-medium font-mono text-sm">
                        {tag.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {tag.display}
                      </div>
                      {tag.description && (
                        <div className="text-xs text-gray-500 mt-1">
                          {tag.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTagTypeColor(tag.type)}>
                        {TAG_TYPE_LABELS[tag.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {tag.mainGenre ? tag.mainGenre.replace('_', ' ') : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {renderTagColor(tag.color)}
                        {tag.color && (
                          <span className="text-xs text-gray-500 font-mono">
                            {tag.color}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {tag.order}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tag.isActive ? "default" : "secondary"}>
                        {tag.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/dashboard/tags/${tag.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={tag.isActive ? "text-red-600" : "text-green-600"}
                          onClick={() => handleStatusToggle(tag)}
                          disabled={toggleLoading}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDelete(tag)}
                          disabled={removeLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {tags.length === 0 && !loading && (
            <div className="text-center py-6 text-muted-foreground">
              No tags found matching your criteria.
            </div>
          )}

          {/* Pagination Controls */}
          {tags.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-500">
                Showing {tags.length} tags
                {totalCount > 0 && ` of ${totalCount.toLocaleString()}`}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPreviousPage}
                  disabled={!pageInfo?.hasPreviousPage}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNextPage(pageInfo?.endCursor)}
                  disabled={!pageInfo?.hasNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Toggle Confirmation Dialog */}
      <Dialog open={modalType === 'toggle'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedTag?.isActive ? 'Deactivate' : 'Activate'} Tag
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {selectedTag?.isActive ? 'deactivate' : 'activate'} the tag &ldquo;{selectedTag?.display}&rdquo;?
              {selectedTag?.isActive && ' This will hide the tag from public queries.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmStatusToggle}
              disabled={toggleLoading}
            >
              {toggleLoading ? 'Updating...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={modalType === 'delete'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the tag &ldquo;{selectedTag?.display}&rdquo;?
              This action cannot be undone and will remove all user assignments of this tag.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmDelete}
              disabled={removeLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {removeLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}