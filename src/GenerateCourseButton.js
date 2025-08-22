import React, { useState} from "react";
import { Button, StandardModal, ActionRow, Form } from "@openedx/paragon";
// import ReactMarkdown from "react-markdown";

export const GenerateCourseButton = () => {
  const [open, setOpen] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [instruction, setInstruction] = useState("");
  const [outline, setOutline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!secretKey.trim() || !instruction.trim()) {
      setError("Please fill in both secret key and instruction");
      return;
    }

    setLoading(true);
    setError("");
    setOutline("");

    try {
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${secretKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that generates detailed course outlines based on user instructions."
            },
            {
              role: "user",
              content: `Create a detailed course outline based on this instruction: ${instruction}. Please be rigid. No opening. Just the outline.`
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const generatedOutline = data.choices[0].message.content;
      setOutline(generatedOutline);
    } catch (err) {
      setError(err.message || "Failed to generate outline");
    } finally {
      setLoading(false);
    }
  };

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
              {loading ? "Generating..." : "Submit"}
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
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
          <Form.Label>
            Instruksi
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Masukkan instruksi Anda di sini..."
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
          />
          
          {error && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              {error}
            </div>
          )}
          
          {outline && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h5>Generated Course Outline:</h5>
              <div style={{ 
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#333'
              }}>
                {/* <ReactMarkdown
                  components={{
                    h1: ({children}) => <h1 style={{color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '8px'}}>{children}</h1>,
                    h2: ({children}) => <h2 style={{color: '#34495e', marginTop: '20px'}}>{children}</h2>,
                    h3: ({children}) => <h3 style={{color: '#7f8c8d', marginTop: '15px'}}>{children}</h3>,
                    strong: ({children}) => <strong style={{color: '#2c3e50'}}>{children}</strong>,
                    code: ({children}) => <code style={{backgroundColor: '#ecf0f1', padding: '2px 4px', borderRadius: '3px', fontFamily: 'monospace'}}>{children}</code>,
                    ul: ({children}) => <ul style={{margin: '10px 0', paddingLeft: '20px'}}>{children}</ul>,
                    ol: ({children}) => <ol style={{margin: '10px 0', paddingLeft: '20px'}}>{children}</ol>,
                    li: ({children}) => <li style={{margin: '5px 0'}}>{children}</li>,
                    p: ({children}) => <p style={{margin: '10px 0'}}>{children}</p>
                  }}
                > */}
                  {outline}
                {/* </ReactMarkdown> */}
              </div>
            </div>
          )}
        </Form>
      </StandardModal>
    </>
  );
};

