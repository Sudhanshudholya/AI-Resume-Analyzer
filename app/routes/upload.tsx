import React, { type FormEvent, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "~/constants";

const Upload = () => {
  const { fs, ai, kv } = usePuterStore();

  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      // 1. Upload PDF
      setStatusText("Uploading the file...");

      const uploadedFile = await fs.upload([file]);

      if (!uploadedFile) {
        throw new Error("Failed to upload PDF");
      }

      // 2. Convert PDF to image
      setStatusText("Converting to image...");

      const imageFile = await convertPdfToImage(file);

      if (!imageFile.file) {
        throw new Error(imageFile.error || "Failed to convert PDF to image");
      }

      // 3. Upload image
      setStatusText("Uploading the image...");

      const uploadedImage = await fs.upload([imageFile.file]);

      if (!uploadedImage) {
        throw new Error("Failed to upload image");
      }

      // 4. Generate ID
      const uuid = generateUUID();

      // 5. Save initial resume data
      setStatusText("Preparing data...");

      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: null,
      };

      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      // 6. AI analysis
      setStatusText("Analyzing your resume...");

      let feedback = null;

      // Retry if Puter returns too_many_requests
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({
              jobTitle,
              jobDescription,
            }),
          );

          if (feedback) break;
        } catch (error: any) {
          console.error(`AI attempt ${attempt} failed:`, error);

          const isTooManyRequests =
            error?.code === "too_many_requests" ||
            error?.error === "Too many concurrent requests.";

          if (!isTooManyRequests || attempt === 3) {
            throw error;
          }

          setStatusText(`AI is busy. Retrying... (${attempt}/3)`);

          await new Promise((resolve) => setTimeout(resolve, attempt * 3000));
        }
      }

      if (!feedback) {
        throw new Error("Failed to generate AI feedback");
      }

      // 7. Extract AI response
      const feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content?.[0]?.text;

      if (!feedbackText) {
        throw new Error("AI returned an empty response");
      }

      console.log("AI Feedback:", feedbackText);

      // 8. Parse JSON
      let parsedFeedback;

      try {
        parsedFeedback = JSON.parse(feedbackText);
      } catch (error) {
        console.error("Invalid AI JSON:", feedbackText);
        throw new Error("AI returned invalid feedback format");
      }

      if (
        typeof parsedFeedback.overallScore !== "number" ||
        typeof parsedFeedback.ATS?.score !== "number" ||
        typeof parsedFeedback.toneAndStyle?.score !== "number" ||
        typeof parsedFeedback.content?.score !== "number" ||
        typeof parsedFeedback.structure?.score !== "number" ||
        typeof parsedFeedback.skills?.score !== "number"
      ) {
        console.error("Invalid AI feedback:", parsedFeedback);
        throw new Error("AI returned incomplete feedback data");
      }

      // 9. Add feedback to data
      data.feedback = parsedFeedback;

      // 10. IMPORTANT: same KV key
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      // 11. Navigate to resume review
      setStatusText("Analysis complete, redirecting...");

      navigate(`/resume/${uuid}`);
    } catch (error: any) {
      console.error("Resume analysis failed:", error);

      setStatusText(
        error?.message || "Something went wrong while analyzing the resume.",
      );

      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isProcessing) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const companyName = formData.get("company-name");
    const jobTitle = formData.get("job-title");
    const jobDescription = formData.get("job-description");

    if (
      typeof companyName !== "string" ||
      typeof jobTitle !== "string" ||
      typeof jobDescription !== "string"
    ) {
      setStatusText("Please fill all the fields.");
      return;
    }

    if (!file) {
      setStatusText("Please upload your resume.");
      return;
    }

    handleAnalyze({
      companyName,
      jobTitle,
      jobDescription,
      file,
    });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>

          {isProcessing ? (
            <>
              <h2>{statusText}</h2>

              <img
                src="/images/resume-scan.gif"
                alt="Scanning resume"
                className="w-[350px] max-sm:w-[280px] mx-auto"
              />
            </>
          ) : (
            <h2>Drop your resume for an ATS Score and improvement tips</h2>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company name</label>

                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>

                <input
                  type="text"
                  name="job-title"
                  placeholder="Job Title"
                  id="job-title"
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>

                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job Description"
                  id="job-description"
                />
              </div>

              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>

                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button
                className="primary-button"
                type="submit"
                disabled={isProcessing}
              >
                {isProcessing ? "Analyzing..." : "Analyze Resume"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
