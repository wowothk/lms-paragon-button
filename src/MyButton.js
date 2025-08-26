import React, { useState} from "react";
import { Button, StandardModal, ActionRow, Hyperlink } from "@openedx/paragon";

export const MyButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline-primary" onClick={() => setOpen(true)}>
        Extra Action Test
      </Button>
      <StandardModal
        title="This is a standard modal dialog"
        isOpen={open}
        onClose={() => setOpen(false)}
        footerNode={(
          <ActionRow>
            <p className="small">
              <Hyperlink destination="#">Get help</Hyperlink>
            </p>
            <ActionRow.Spacer />
            <Button variant="tertiary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button>Submit</Button>
          </ActionRow>
        )}
        isOverflowVisible={false}
      >
        <p>
          I'm baby palo santo ugh celiac fashion axe. La croix lo-fi venmo whatever. Beard man braid migas single-origin coffee forage ramps. Tumeric messenger bag bicycle rights wayfarers, try-hard cronut blue bottle health goth. Sriracha tumblr cardigan, cloud bread succulents tumeric copper mug marfa semiotics woke next level organic roof party +1 try-hard.
        </p>
      </StandardModal>
    </>
  );
};

