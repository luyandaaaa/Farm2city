import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload } from "lucide-react";
import { toast } from "sonner";

interface ComplaintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  orderId: string;
  onSubmit: (data: ComplaintData) => void;
}

export interface ComplaintData {
  issueType: string;
  description: string;
  images: string[];
}

const issueTypes = [
  "Damaged Product",
  "Wrong Item",
  "Expired Product",
  "Poor Quality",
  "Missing Item",
  "Other"
];

export default function ComplaintModal({ open, onOpenChange, productName, orderId, onSubmit }: ComplaintModalProps) {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!issueType || !description) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      // Simulate async submission (replace with API call if needed)
      await new Promise(res => setTimeout(res, 1000));
      onSubmit({ issueType, description, images });
      setIssueType("");
      setDescription("");
      setImages([]);
      onOpenChange(false);
      toast.success("Complaint submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report an Issue with {productName}</DialogTitle>
          <p className="text-sm text-muted-foreground">Order: {orderId}</p>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="issue-type">Issue Type *</Label>
            <Select value={issueType} onValueChange={setIssueType} disabled={submitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Please describe the issue in detail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              disabled={submitting}
            />
          </div>
          <div className="space-y-2">
            <Label>Upload Images (Optional)</Label>
            <div className="flex gap-2 flex-wrap">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} alt="Complaint evidence" className="w-16 h-16 object-cover rounded" />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    onClick={() => handleRemoveImage(index)}
                    aria-label="Remove image"
                    disabled={submitting}
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className="w-16 h-16 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={submitting} />
              </label>
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Complaint"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}