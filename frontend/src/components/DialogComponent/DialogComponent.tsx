import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";

export function DialogComponent({ isOpen, setIsOpen }) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this user?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Button type="submit" size="sm" className="px-3 bg-red-500">
            DELETE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
