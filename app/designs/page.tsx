"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm";
import { Heart, ImageIcon, Trash2 } from "lucide-react";
import { useAppContext } from "@/app/context/AppContext";

interface Design {
  id: number;
  imageUrl: string;
  finalPrice: number;
  category: string | null;
  isShortlisted: boolean;
  meeting: {
    vendorName: string;
    location: string;
  };
}

function EmptyState() {
  return (
    <Card className="p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-purple-100 p-3 rounded-full">
          <ImageIcon className="w-6 h-6 text-purple-500" />
        </div>
      </div>
      <h3 className="text-lg font-medium mb-2">No designs yet</h3>
      <p className="text-gray-500 mb-4">
        Your design library is empty. Start by recording vendor meetings!
      </p>
      <Link href="/meetings/new">
        <Button>Record New Meeting</Button>
      </Link>
    </Card>
  );
}

function DesignCard({
  design,
  onDelete,
}: {
  design: Design;
  onDelete: () => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();
  const { refreshData } = useAppContext();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/designs/${design.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast({
        title: "Design deleted!",
        description: "The design has been removed from your library.",
      });

      // Refresh global stats
      await refreshData();
      // Refresh local designs list
      onDelete();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete design. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={design.imageUrl}
          alt={`Design from ${design.meeting.vendorName}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Delete and Shortlist Controls */}
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="w-8 h-8 bg-white/80 hover:bg-white"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
          {design.isShortlisted && (
            <div className="w-8 h-8 rounded-md bg-white/80 flex items-center justify-center">
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            </div>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-medium text-sm">{design.meeting.vendorName}</p>
            <p className="text-xs text-gray-500">{design.meeting.location}</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            ₹{(design.finalPrice / 100).toLocaleString()}
          </Badge>
        </div>
        {design.category && (
          <Badge variant="outline" className="text-xs">
            {design.category}
          </Badge>
        )}
      </div>

      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Design"
        description="Are you sure you want to delete this design? This action cannot be undone."
      />
    </Card>
  );
}

function DesignGrid() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const { toast } = useToast();

  const fetchDesigns = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/designs?t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      const data = await response.json();
      if (data.success) {
        setDesigns(data.data);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load designs. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  if (designs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {designs.map((design) => (
        <DesignCard key={design.id} design={design} onDelete={fetchDesigns} />
      ))}
    </div>
  );
}

export default function DesignsPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Design Library</h1>
        <p className="text-gray-500">
          Browse and organize your design collection
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <DesignGrid />
      </Suspense>
    </div>
  );
}
