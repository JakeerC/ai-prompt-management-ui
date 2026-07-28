"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApprove, useReject, useAssignReviewer } from "@/hooks/use-approvals";
import { useUsers } from "@/hooks/use-users";
import { CheckCircle2, XCircle, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface ApprovalActionsProps {
  promptId: string;
}

export function ApprovalActions({ promptId }: ApprovalActionsProps) {
  const [approveComments, setApproveComments] = useState("");
  const [rejectComments, setRejectComments] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const approveMutation = useApprove();
  const rejectMutation = useReject();
  const assignMutation = useAssignReviewer();
  
  const { data: usersData, isLoading: loadingUsers } = useUsers();
  // Filter only REVIEWERs and ADMINs for assignment
  const availableReviewers = usersData?.users.filter(u => u.role === "REVIEWER" || u.role === "ADMIN") || [];

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync({
        promptId,
        data: { comments: approveComments || undefined }
      });
      toast.success("Prompt approved successfully");
      setIsApproveOpen(false);
      setApproveComments("");
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to approve prompt");
    }
  };

  const handleReject = async () => {
    if (!rejectComments.trim()) {
      toast.error("Comments are required for rejection");
      return;
    }
    try {
      await rejectMutation.mutateAsync({
        promptId,
        data: { comments: rejectComments }
      });
      toast.success("Prompt rejected successfully");
      setIsRejectOpen(false);
      setRejectComments("");
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to reject prompt");
    }
  };

  const handleAssign = async () => {
    if (!assigneeId) {
      toast.error("Please select a reviewer");
      return;
    }
    try {
      await assignMutation.mutateAsync({
        promptId,
        data: { reviewerId: assigneeId }
      });
      toast.success("Reviewer assigned successfully");
      setIsAssignOpen(false);
      setAssigneeId("");
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to assign reviewer");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogTrigger render={
          <Button variant="outline" className="text-green-600 border-green-600/20 hover:bg-green-600/10 glass">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Approve
          </Button>
        } />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this prompt? This will make it available for use.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="approve-comments">Comments (Optional)</Label>
              <Textarea
                id="approve-comments"
                placeholder="Add any feedback or comments here..."
                value={approveComments}
                onChange={(e) => setApproveComments(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
            <Button onClick={handleApprove} disabled={approveMutation.isPending}>
              {approveMutation.isPending ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogTrigger render={
          <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10 glass">
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
        } />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Prompt</DialogTitle>
            <DialogDescription>
              Provide feedback on why this prompt is being rejected. The author will need to make changes and submit for review again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-comments">Comments (Required)</Label>
              <Textarea
                id="reject-comments"
                placeholder="Explain what needs to be changed..."
                value={rejectComments}
                onChange={(e) => setRejectComments(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleReject} 
              disabled={rejectMutation.isPending || !rejectComments.trim()}
            >
              {rejectMutation.isPending ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogTrigger render={
          <Button variant="outline" className="text-blue-600 border-blue-600/20 hover:bg-blue-600/10 glass">
            <UserPlus className="w-4 h-4 mr-2" />
            Assign Reviewer
          </Button>
        } />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Reviewer</DialogTitle>
            <DialogDescription>
              Assign a specific reviewer to evaluate this prompt.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="assignee">Reviewer</Label>
              <Select value={assigneeId} onValueChange={(value: string | null) => setAssigneeId(value || "")} disabled={loadingUsers}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder={loadingUsers ? "Loading users..." : "Select a reviewer"} />
                </SelectTrigger>
                <SelectContent>
                  {availableReviewers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email} ({user.role})
                    </SelectItem>
                  ))}
                  {availableReviewers.length === 0 && !loadingUsers && (
                    <SelectItem value="none" disabled>No reviewers available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAssign} 
              disabled={assignMutation.isPending || !assigneeId}
            >
              {assignMutation.isPending ? "Assigning..." : "Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
