import React, { useState } from "react";
import { Button, StandardModal, ActionRow, Form, Spinner, Alert } from "@openedx/paragon";
import ReactMarkdown from "react-markdown";

export const GenerateCourseButton = ({ 
  secretKey = "",
  org = "test",
  course = "Cs01", 
  run = "2022",
  sessionId = ""
}) => {
  const [open, setOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [outline, setOutline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setInstruction("");
    setOutline("");
    setError("");
    setSuccess(false);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!secretKey.trim() || !instruction.trim()) {
      setError("Please provide secret key and fill in instruction");
      return;
    }

    setLoading(true);
    setError("");
    setOutline("");
    setSuccess(false);

    try {
      // Step 1: Generate outline using DeepSeek API
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
              content: `Create a detailed course outline based on this instruction: ${instruction}. 
              Please be rigid and make sure that the result are using JSON format below:

              [
                  {
                      "title": "title of the section",
                      "subsections": [
                          {"title": "title of the subsection 1 "},
                          {"title": "title of the subsection 2"}
                      ]
                  }
              ]
              
              `
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

      // Step 2: Parse the outline and create course data
      let parsedOutline;
      try {
        // Extract JSON from the response (in case there's extra text)
        const jsonMatch = generatedOutline.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : generatedOutline;
        parsedOutline = JSON.parse(jsonString);
      } catch (parseError) {
        throw new Error("Failed to parse outline JSON");
      }

      // Step 3: Prepare course data in the required format
      const courseData = {
        org,
        course,
        run,
        sections: parsedOutline
      };

      // Step 4: Make POST request to generate course
      const courseResponse = await fetch("/api/tutor_course_helper/generate-course/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `sessionid=${sessionId}`
        },
        body: JSON.stringify(courseData)
      });

      if (!courseResponse.ok) {
        throw new Error(`Course generation failed: ${courseResponse.status} ${courseResponse.statusText}`);
      }

      const courseResult = await courseResponse.json();
      console.log("Course generated successfully:", courseResult);
      setSuccess(true);

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
        onClose={() => {
          setOpen(false);
          resetForm();  
        }}
        footerNode={
          loading ? null : success ? (
            <ActionRow>
              <ActionRow.Spacer />
              <Button variant="tertiary" onClick={resetForm}>Generate Another</Button>
              <Button onClick={() => {
                setOpen(false);
                resetForm();
              }}>Close</Button>
            </ActionRow>
          ) : (
            <ActionRow>
              <ActionRow.Spacer />
              <Button variant="tertiary" onClick={() => {
                setOpen(false);
                resetForm();
              }}>Cancel</Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </ActionRow>
          )
        }
        isOverflowVisible={false}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Spinner animation="border" size="lg" />
            <p style={{ marginTop: '20px', fontSize: '16px' }}>Please wait for a moment.</p>
          </div>
        ) : success ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Alert variant="success">
              Your outline was generated successfully
            </Alert>
            {outline && (
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px', textAlign: 'left' }}>
                <h5>Generated Course Outline:</h5>
                <div style={{ 
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#333'
                }}>
                  <ReactMarkdown
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
                  >
                    {outline}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Form>
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
              <Alert variant="danger" style={{ marginTop: '10px' }}>
                {error}
              </Alert>
            )}
          </Form>
        )}
      </StandardModal>
    </>
  );
};

