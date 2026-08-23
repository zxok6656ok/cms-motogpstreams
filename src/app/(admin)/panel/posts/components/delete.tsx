import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

type DeleteProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string | undefined;
  id: string | undefined
  onDelete: (postId: string) => Promise<void>
};
const Delete = ({ open, setOpen, title, id, onDelete }: DeleteProps) => {
  if(!id) return
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Delete Post"
      className="rounded-sm w-sm"
      footer={
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 w-full">
          <Button
            type="button"
            variant="destructive"
            onClick={() => onDelete(id)}
            className="order-1 sm:order-2"
          >
            Delete
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="order-2 sm:order-1"
          >
            Close
          </Button>
        </div>
      }
    >
      <div>
        This will permanently delete <span className="text-red-500">"{title}"</span> this Post.
      </div>
    </Modal>
  );
};

export default Delete;
