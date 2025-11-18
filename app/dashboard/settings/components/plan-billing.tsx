"use client";

import { Download, CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { formatPrice, formatDate } from '../utils';

// Mock billing data
const mockBillingData = {
  currentPlan: {
    name: 'Membership Pro',
    price: 49,
    features: [
      '10 events per month',
      'Up to 1,000 attendees total',
      'Priority support',
      'Advanced analytics'
    ],
    billingCycle: 'monthly'
  },
  paymentMethod: {
    type: 'Credit Card',
    last4: '4242',
    expiryDate: '12/25',
    brand: 'Visa'
  },
  recentBilling: [
    {
      id: '1',
      date: '2025-04-19',
      amount: 49.00,
      status: 'Paid',
      description: 'Membership Pro',
      downloadUrl: '#'
    },
    {
      id: '2',
      date: '2025-03-15',
      amount: 49.00,
      status: 'Paid',
      description: 'Membership Pro',
      downloadUrl: '#'
    },
    {
      id: '3',
      date: '2025-02-12',
      amount: 19.00,
      status: 'Paid',
      description: 'Membership Starter',
      downloadUrl: '#'
    }
  ]
};

export function PlanBilling() {
  const { currentPlan, recentBilling } = mockBillingData;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleDownloadCSV = () => {
    // Mock CSV download functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Description,Amount,Status\n" +
      recentBilling.map(bill => 
        `${formatDate(bill.date)},${bill.description},${formatPrice(bill.amount)},${bill.status}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "billing-history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-blue-600 text-white mb-2">
                Current Plan
              </Badge>
              <CardTitle className="text-2xl">{currentPlan.name}</CardTitle>
              <p className="text-muted-foreground">
                For growing organizations with advanced features and priority support.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatPrice(currentPlan.price)}</div>
              <p className="text-muted-foreground">per month</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="text-center">
                <p className="font-medium">{feature}</p>
              </div>
            ))}
          </div>
          
          <Button className="bg-orange-600 hover:bg-orange-700">
            Speak to a sales representative
          </Button>
        </CardContent>
      </Card>

      {/* Payment Method & Recent Billing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-blue-50 rounded">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">No payment method on file.</p>
                  <p className="text-sm text-muted-foreground">
                    Add a credit card or ACH account.
                  </p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                Create a payment method
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Billing */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Billing</CardTitle>
            <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBilling.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{bill.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(bill.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(bill.amount)}</p>
                    <Badge className={getStatusColor(bill.status)}>
                      {bill.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t">
              <Button variant="link" className="text-blue-600 p-0">
                View all charges
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing History Table (Alternative view) */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBilling.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>{formatDate(bill.date)}</TableCell>
                  <TableCell>{bill.description}</TableCell>
                  <TableCell>{formatPrice(bill.amount)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(bill.status)}>
                      {bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}