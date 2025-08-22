import React, { useState } from "react";
import { Button, StandardModal, ActionRow, Hyperlink } from "@openedx/paragon";

export const RGCButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline-primary" onClick={() => setOpen(true)}>
        Generate Course With AI
      </Button>
      <StandardModal
        title="Generate Course With AI"
        isOpen={open}
        onClose={() => setOpen(false)}
        footerNode={(
          <ActionRow>
            <p className="small">
              <Hyperlink destination="#">Get help</Hyperlink>
            </p>
            <ActionRow.Spacer />
            <Button variant="tertiary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>
              Generate
            </Button>
          </ActionRow>
        )}
        isOverflowVisible={false}
      >
        <p>ini seharusnya formulir</p>
      </StandardModal>
    </>
  );
};

