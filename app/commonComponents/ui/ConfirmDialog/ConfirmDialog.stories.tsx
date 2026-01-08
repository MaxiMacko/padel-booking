import type { Meta, StoryObj } from "@storybook/nextjs";
import { ConfirmDialog } from "./ConfirmDialog";
import { useState } from "react";
import { Button } from "../Button/Button";

const meta: Meta<typeof ConfirmDialog> = {
  title: "UI/ConfirmDialog",
  component: ConfirmDialog,
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>
          Delete schedule
        </Button>

        <ConfirmDialog
          open={open}
          title="Delete slot?"
          description="This action cannot be undone."
          variant="danger"
          confirmText="Delete"
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            alert("Deleted");
            setOpen(false);
          }}
        />
      </>
    );
  },
};
