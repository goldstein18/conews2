"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { Settings, Plus, Edit, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/auth-store";
import { GET_PLANS, UPDATE_PLAN } from "@/lib/graphql/plans";
import { PlansResponse, Plan, UpdatePlanResponse, PlanStatus } from "@/types/plans";
import { updatePlanSchema, UpdatePlanFormData } from "./lib/validations";

export default function PlansPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data, loading, error, refetch } = useQuery<PlansResponse>(GET_PLANS);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  const [updatePlan, { loading: updateLoading }] = useMutation<UpdatePlanResponse>(UPDATE_PLAN, {
    onCompleted: () => {
      setEditModalOpen(false);
      setSelectedPlan(null);
      refetch();
    },
    onError: (error) => {
      console.error('Error updating plan:', error);
    }
  });

  const form = useForm<UpdatePlanFormData>({
    resolver: zodResolver(updatePlanSchema),
    defaultValues: {
      description: '',
      active: true,
    },
  });

  const handleEditClick = (plan: Plan) => {
    setSelectedPlan(plan);
    form.reset({
      description: plan.description || '',
      active: plan.status === PlanStatus.ACTIVE,
    });
    setEditModalOpen(true);
  };

  const onSubmit = async (values: UpdatePlanFormData) => {
    if (!selectedPlan) return;
    
    const updateInput = {
      description: values.description,
      status: values.active ? 'ACTIVE' : 'INACTIVE',
    };
    
    console.log('Updating plan with:', {
      id: selectedPlan.id,
      updatePlanInput: updateInput
    });
    
    try {
      await updatePlan({
        variables: {
          id: selectedPlan.id,
          updatePlanInput: updateInput,
        },
      });
    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };

  useEffect(() => {
    if (user && user.role?.name !== 'SUPER_ADMIN') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user?.role?.name !== 'SUPER_ADMIN') {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Access denied. SUPER_ADMIN role required.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading plans: {error.message}</p>
        </div>
      </div>
    );
  }

  const plans = data?.plans || [];

  const formatPrice = (priceInCents: number) => {
    const priceInDollars = priceInCents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(priceInDollars);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <div>
              <CardTitle>Membership Plans</CardTitle>
              <CardDescription>
                Manage all membership plans and their pricing
              </CardDescription>
            </div>
          </div>
          <Button onClick={() => router.push('/dashboard/plans/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">
                    {plan.plan}
                  </TableCell>
                  <TableCell>
                    {formatPrice(plan.price)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={plan.status === PlanStatus.ACTIVE ? "default" : "secondary"}>
                      {plan.status === PlanStatus.ACTIVE ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {plan.description || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditClick(plan)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {plans.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No plans found. Create your first plan to get started.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>
              Update the plan details
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md">
                  {selectedPlan?.plan}
                </div>
                <p className="text-xs text-gray-500 mt-1">Plan name cannot be modified</p>
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Basic calendar access and event listing" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Plan is available for purchase
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={updateLoading}>
                  {updateLoading ? 'Updating...' : 'Update Plan'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}