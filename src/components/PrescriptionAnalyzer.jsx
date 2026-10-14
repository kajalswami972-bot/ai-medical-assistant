import React, { useState } from "react";

export default function PrescriptionAnalyzer({ setScreen }) {
  const [base64Image, setBase64Image] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");

  // Upload and convert image to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    setError("");
    setResult("");
    setBase64Image(null);
    setImagePreview("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    // Limit image size to 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result;

      if (typeof dataUrl !== "string") {
        setError("Unable to read the image.");
        return;
      }

      // Keep the complete Data URL, including MIME type
      setBase64Image(dataUrl);
      setImagePreview(dataUrl);
    };

    reader.onerror = () => {
      setError("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  // Analyze uploaded medical report
  const analyze = async () => {
    if (!base64Image) {
      setError("Please upload a medical report image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch(
        "https://ai-medical-backend-0ick.onrender.com/api/analyze-report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            base64Image,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Request failed (${response.status})`
        );
      }

      if (!data.result) {
        throw new Error("The AI returned an empty result.");
      }

      // Display the AI response as plain text
      const cleanedResult = data.result
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/<br\s*\/?>/gi, "\n")
        .trim();

      setResult(cleanedResult);
    } catch (err) {
      console.error("Report analysis error:", err);

      setError(
        err.message ||
          "Unable to analyze the report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        color: "#263238",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button
          type="button"
          onClick={() => setScreen("dashboard")}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "24px",
          }}
          aria-label="Back to dashboard"
        >
          ←
        </button>

        <h2>Medical Report Analyzer</h2>
      </div>

      <p>
        Upload a clear image of your medical report to understand
        the visible test results.
      </p>

      {/* Image Upload */}
      <div
        style={{
          border: "2px dashed #aaa",
          padding: "20px",
          textAlign: "center",
          margin: "20px 0",
          borderRadius: "10px",
          background: "#f8fafc",
        }}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageUpload}
          disabled={loading}
        />

        <p style={{ fontSize: "13px", color: "#666" }}>
          Supported formats: JPG, PNG and WEBP. Maximum size: 5 MB.
        </p>
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Uploaded Report</h3>

          <img
            src={imagePreview}
            alt="Uploaded medical report preview"
            style={{
              display: "block",
              width: "100%",
              maxHeight: "350px",
              objectFit: "contain",
              border: "1px solid #ddd",
              borderRadius: "8px",
              background: "#fff",
            }}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          style={{
            background: "#ffebee",
            color: "#b71c1c",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "15px",
            overflowWrap: "anywhere",
          }}
        >
          {error}
        </div>
      )}

      {/* Results */}
      <h3>Analysis Results</h3>

      <div
        aria-live="polite"
        style={{
          width: "100%",
          minHeight: "200px",
          maxHeight: "450px",
          boxSizing: "border-box",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "15px",
          overflowY: "auto",
          overflowWrap: "anywhere",
          backgroundColor: "#fff",
          marginBottom: "20px",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <pre
          style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            margin: 0,
            fontFamily: "inherit",
            lineHeight: 1.6,
          }}
        >
          {loading
            ? "Analyzing your report... Please wait."
            : result || "Your analysis will appear here."}
        </pre>
      </div>

      {/* Analyze Button */}
      <button
        type="button"
        onClick={analyze}
        disabled={loading || !base64Image}
        style={{
          width: "100%",
          padding: "15px",
          background: loading || !base64Image ? "#90a4ae" : "#009688",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: loading || !base64Image ? "not-allowed" : "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Analyzing..." : "Analyze Medical Report"}
      </button>

      {/* Medical Disclaimer */}
      <p
        style={{
          marginTop: "20px",
          fontSize: "12px",
          color: "#666",
          lineHeight: 1.6,
        }}
      >
        Note: This AI-generated explanation may contain errors.
        It is not a medical diagnosis. Consult a qualified healthcare
        professional before making decisions about your health.
      </p>
    </div>
  );
}