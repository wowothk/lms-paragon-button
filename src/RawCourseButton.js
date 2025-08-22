import React, { useState} from "react";
import { Button, StandardModal, ActionRow, Form } from "@openedx/paragon";

export const RawCourseButton = () => {
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
            <ActionRow.Spacer />
            <Button variant="tertiary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>
                Generate
            </Button>
          </ActionRow>
        )}
        isOverflowVisible={false}
      >
        <Form>
          <Form.Label>
            Secret Key
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="Masukkan key"
          />
          <Form.Label>
            Instruksi
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Masukkan instruksi Anda di sini..."
          />
          
        </Form>
      </StandardModal>
    </>
  );
};

