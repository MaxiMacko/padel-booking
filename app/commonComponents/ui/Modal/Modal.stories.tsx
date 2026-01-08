import type { Meta, StoryObj } from "@storybook/nextjs";
import { Modal } from "./Modal";
import { useState } from "react";
import { Button } from "../Button/Button";

const meta: Meta<typeof Modal> = {
  title: "UI/Modal",
  component: Modal,
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Example modal"
        >
          <p className="mb-4 text-sm text-gray-600">
            Modal content goes here
          </p>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Modal>
      </>
    );
  },
};
