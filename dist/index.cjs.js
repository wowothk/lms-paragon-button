'use strict';

var React = require('react');
var paragon = require('@openedx/paragon');

const MyButton = () => {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(paragon.Button, {
    variant: "outline-primary",
    onClick: () => setOpen(true)
  }, "Extra Action"), /*#__PURE__*/React.createElement(paragon.StandardModal, {
    title: "This is a standard modal dialog",
    isOpen: open,
    onClose: () => setOpen(false),
    footerNode: /*#__PURE__*/React.createElement(paragon.ActionRow, null, /*#__PURE__*/React.createElement("p", {
      className: "small"
    }, /*#__PURE__*/React.createElement(paragon.Hyperlink, {
      destination: "#"
    }, "Get help")), /*#__PURE__*/React.createElement(paragon.ActionRow.Spacer, null), /*#__PURE__*/React.createElement(paragon.Button, {
      variant: "tertiary",
      onClick: () => setOpen(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(paragon.Button, null, "Submit")),
    isOverflowVisible: false
  }, /*#__PURE__*/React.createElement("p", null, "I'm baby palo santo ugh celiac fashion axe. La croix lo-fi venmo whatever. Beard man braid migas single-origin coffee forage ramps. Tumeric messenger bag bicycle rights wayfarers, try-hard cronut blue bottle health goth. Sriracha tumblr cardigan, cloud bread succulents tumeric copper mug marfa semiotics woke next level organic roof party +1 try-hard.")));
};

// import ReactMarkdown from "react-markdown";

const GenerateCourseButton = () => {
  const [open, setOpen] = React.useState(false);
  const [secretKey, setSecretKey] = React.useState("");
  const [instruction, setInstruction] = React.useState("");
  const [outline, setOutline] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
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
          "Authorization": `Bearer ${secretKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{
            role: "system",
            content: "You are a helpful assistant that generates detailed course outlines based on user instructions."
          }, {
            role: "user",
            content: `Create a detailed course outline based on this instruction: ${instruction}. Please be rigid. No opening. Just the outline.`
          }],
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(paragon.Button, {
    variant: "outline-primary",
    onClick: () => setOpen(true)
  }, "Generate Course With AI"), /*#__PURE__*/React.createElement(paragon.StandardModal, {
    title: "Generate Course With AI",
    isOpen: open,
    onClose: () => setOpen(false),
    footerNode: /*#__PURE__*/React.createElement(paragon.ActionRow, null, /*#__PURE__*/React.createElement(paragon.ActionRow.Spacer, null), /*#__PURE__*/React.createElement(paragon.Button, {
      variant: "tertiary",
      onClick: () => setOpen(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(paragon.Button, {
      onClick: handleSubmit,
      disabled: loading
    }, loading ? "Generating..." : "Submit")),
    isOverflowVisible: false
  }, /*#__PURE__*/React.createElement(paragon.Form, null, /*#__PURE__*/React.createElement(paragon.Form.Label, null, "Secret Key"), /*#__PURE__*/React.createElement(paragon.Form.Control, {
    type: "password",
    placeholder: "Masukkan key",
    value: secretKey,
    onChange: e => setSecretKey(e.target.value)
  }), /*#__PURE__*/React.createElement(paragon.Form.Label, null, "Instruksi"), /*#__PURE__*/React.createElement(paragon.Form.Control, {
    as: "textarea",
    rows: 5,
    placeholder: "Masukkan instruksi Anda di sini...",
    value: instruction,
    onChange: e => setInstruction(e.target.value)
  }), error && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'red',
      marginTop: '10px'
    }
  }, error), outline && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px'
    }
  }, /*#__PURE__*/React.createElement("h5", null, "Generated Course Outline:"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#333'
    }
  }, outline)))));
};

exports.GenerateCourseButton = GenerateCourseButton;
exports.MyButton = MyButton;
