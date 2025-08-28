import React, { useState } from 'react';
import { Button, StandardModal, ActionRow, Hyperlink, Spinner, Alert, Form } from '@openedx/paragon';
import ReactMarkdown from 'react-markdown';

const MyButton = () => {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    variant: "outline-primary",
    onClick: () => setOpen(true)
  }, "Extra Action Test"), /*#__PURE__*/React.createElement(StandardModal, {
    title: "This is a standard modal dialog",
    isOpen: open,
    onClose: () => setOpen(false),
    footerNode: /*#__PURE__*/React.createElement(ActionRow, null, /*#__PURE__*/React.createElement("p", {
      className: "small"
    }, /*#__PURE__*/React.createElement(Hyperlink, {
      destination: "#"
    }, "Get help")), /*#__PURE__*/React.createElement(ActionRow.Spacer, null), /*#__PURE__*/React.createElement(Button, {
      variant: "tertiary",
      onClick: () => setOpen(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, null, "Submit")),
    isOverflowVisible: false
  }, /*#__PURE__*/React.createElement("p", null, "I'm baby palo santo ugh celiac fashion axe. La croix lo-fi venmo whatever. Beard man braid migas single-origin coffee forage ramps. Tumeric messenger bag bicycle rights wayfarers, try-hard cronut blue bottle health goth. Sriracha tumblr cardigan, cloud bread succulents tumeric copper mug marfa semiotics woke next level organic roof party +1 try-hard.")));
};

const GenerateCourseButton = ({
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
    console.log("Secret Key:", secretKey); // Debugging line
    console.log("Session Id:", sessionId); // Debugging line
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
          "Authorization": `Bearer ${secretKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{
            role: "system",
            content: "You are a helpful assistant that generates detailed course outlines based on user instructions."
          }, {
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
          }],
          max_tokens: 1000,
          temperature: 0.7
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const responseText = await response.text();
      console.log("Raw API Response:", responseText);
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse API response as JSON:", responseText);
        throw new Error(`Invalid JSON response from API: ${parseError.message}`);
      }
      const generatedOutline = data.choices[0].message.content;
      console.log("Generated Outline:", generatedOutline);
      setOutline(generatedOutline);

      // Step 2: Parse the outline and create course data
      let parsedOutline;
      try {
        // 1. Remove Markdown code fences if present
        let cleanText = generatedOutline.replace(/```json/g, "").replace(/```/g, "").trim();

        // 2. Extract JSON array from the text
        const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : cleanText;

        // 3. Parse into JS object
        parsedOutline = JSON.parse(jsonString);
        console.log("Parsed outline:", parsedOutline);
      } catch (err) {
        console.error("Failed to parse outline JSON:", err);
      }

      // Step 3: Prepare course data in the required format
      const courseData = {
        org,
        course,
        run,
        sections: parsedOutline
      };

      // Step 4: Make POST request to generate course
      const courseResponse = await fetch("http://local.openedx.io/api/tutor_course_helper/generate-course/", {
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    variant: "outline-primary",
    onClick: () => setOpen(true)
  }, "Generate Course With AI"), /*#__PURE__*/React.createElement(StandardModal, {
    title: "Generate Course With AI",
    isOpen: open,
    onClose: () => {
      setOpen(false);
      resetForm();
    },
    footerNode: loading ? null : success ? /*#__PURE__*/React.createElement(ActionRow, null, /*#__PURE__*/React.createElement(ActionRow.Spacer, null), /*#__PURE__*/React.createElement(Button, {
      variant: "tertiary",
      onClick: resetForm
    }, "Generate Another"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        setOpen(false);
        resetForm();
        window.location.reload();
      }
    }, "Close")) : /*#__PURE__*/React.createElement(ActionRow, null, /*#__PURE__*/React.createElement(ActionRow.Spacer, null), /*#__PURE__*/React.createElement(Button, {
      variant: "tertiary",
      onClick: () => {
        setOpen(false);
        resetForm();
      }
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      onClick: handleSubmit
    }, "Submit")),
    isOverflowVisible: false
  }, loading ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '40px 20px'
    }
  }, /*#__PURE__*/React.createElement(Spinner, {
    animation: "border",
    size: "lg"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '20px',
      fontSize: '16px',
      textAlig: 'center'
    }
  }, "Please wait for a moment.")) : success ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '40px 20px'
    }
  }, /*#__PURE__*/React.createElement(Alert, {
    variant: "success",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    fill: "#28a745",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24px",
    height: "24px",
    viewBox: "0 0 52 52",
    enableBackground: "new 0 0 52 52",
    xmlSpace: "preserve"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M26,2C12.7,2,2,12.7,2,26s10.7,24,24,24s24-10.7,24-24S39.3,2,26,2z M39.4,20L24.1,35.5 c-0.6,0.6-1.6,0.6-2.2,0L13.5,27c-0.6-0.6-0.6-1.6,0-2.2l2.2-2.2c0.6-0.6,1.6-0.6,2.2,0l4.4,4.5c0.4,0.4,1.1,0.4,1.5,0L35,15.5 c0.6-0.6,1.6-0.6,2.2,0l2.2,2.2C40.1,18.3,40.1,19.3,39.4,20z"
  })), "Your outline was generated successfully"), outline && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("h5", null, "Generated Course Outline:"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#333'
    }
  }, /*#__PURE__*/React.createElement(ReactMarkdown, {
    components: {
      h1: ({
        children
      }) => /*#__PURE__*/React.createElement("h1", {
        style: {
          color: '#2c3e50',
          borderBottom: '2px solid #3498db',
          paddingBottom: '8px'
        }
      }, children),
      h2: ({
        children
      }) => /*#__PURE__*/React.createElement("h2", {
        style: {
          color: '#34495e',
          marginTop: '20px'
        }
      }, children),
      h3: ({
        children
      }) => /*#__PURE__*/React.createElement("h3", {
        style: {
          color: '#7f8c8d',
          marginTop: '15px'
        }
      }, children),
      strong: ({
        children
      }) => /*#__PURE__*/React.createElement("strong", {
        style: {
          color: '#2c3e50'
        }
      }, children),
      code: ({
        children
      }) => /*#__PURE__*/React.createElement("code", {
        style: {
          backgroundColor: '#ecf0f1',
          padding: '2px 4px',
          borderRadius: '3px',
          fontFamily: 'monospace'
        }
      }, children),
      ul: ({
        children
      }) => /*#__PURE__*/React.createElement("ul", {
        style: {
          margin: '10px 0',
          paddingLeft: '20px'
        }
      }, children),
      ol: ({
        children
      }) => /*#__PURE__*/React.createElement("ol", {
        style: {
          margin: '10px 0',
          paddingLeft: '20px'
        }
      }, children),
      li: ({
        children
      }) => /*#__PURE__*/React.createElement("li", {
        style: {
          margin: '5px 0'
        }
      }, children),
      p: ({
        children
      }) => /*#__PURE__*/React.createElement("p", {
        style: {
          margin: '10px 0'
        }
      }, children)
    }
  }, outline)))) : /*#__PURE__*/React.createElement(Form, null, /*#__PURE__*/React.createElement(Form.Label, null, "Instruksi"), /*#__PURE__*/React.createElement(Form.Control, {
    as: "textarea",
    rows: 5,
    placeholder: "Masukkan instruksi Anda di sini...",
    value: instruction,
    onChange: e => setInstruction(e.target.value)
  }), error && /*#__PURE__*/React.createElement(Alert, {
    variant: "danger",
    style: {
      marginTop: '10px'
    }
  }, error))));
};

export { GenerateCourseButton, MyButton };
