export const resumes: Resume[] = [
  {
    id: "1",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume_01.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: {
      overallScore: 85,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "2",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume_02.png",
    resumePath: "/resumes/resume-2.pdf",
    feedback: {
      overallScore: 55,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "3",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "4",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "5",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "6",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
];

export const AIResponseFormat = `
{
  "overallScore": 0,
  "ATS": {
    "score": 0,
    "tips": [
      {
        "type": "good",
        "tip": "Example positive ATS point"
      },
      {
        "type": "improve",
        "tip": "Example ATS improvement"
      },
      {
        "type": "improve",
        "tip": "Another ATS improvement"
      }
    ]
  },
  "toneAndStyle": {
    "score": 0,
    "tips": [
      {
        "type": "good",
        "tip": "Clear professional tone",
        "explanation": "Explain why this is good."
      },
      {
        "type": "improve",
        "tip": "Improve wording",
        "explanation": "Explain specifically what should be improved."
      },
      {
        "type": "improve",
        "tip": "Use stronger language",
        "explanation": "Explain how the candidate can improve the wording."
      }
    ]
  },
  "content": {
    "score": 0,
    "tips": [
      {
        "type": "good",
        "tip": "Relevant experience",
        "explanation": "Explain the relevant content."
      },
      {
        "type": "improve",
        "tip": "Add measurable achievements",
        "explanation": "Explain what achievements should be quantified."
      },
      {
        "type": "improve",
        "tip": "Improve career summary",
        "explanation": "Explain how the summary can be improved."
      }
    ]
  },
  "structure": {
    "score": 0,
    "tips": [
      {
        "type": "good",
        "tip": "Readable structure",
        "explanation": "Explain what works well."
      },
      {
        "type": "improve",
        "tip": "Improve section organization",
        "explanation": "Explain how the structure can be improved."
      },
      {
        "type": "improve",
        "tip": "Improve consistency",
        "explanation": "Explain formatting or organization improvements."
      }
    ]
  },
  "skills": {
    "score": 0,
    "tips": [
      {
        "type": "good",
        "tip": "Relevant technical skills",
        "explanation": "Explain which skills are relevant."
      },
      {
        "type": "improve",
        "tip": "Add missing skills",
        "explanation": "Explain which skills would improve the resume."
      },
      {
        "type": "improve",
        "tip": "Prioritize relevant skills",
        "explanation": "Explain how to improve the skills section."
      }
    ]
  }
}
`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription: string;
}) =>
  `
You are an expert ATS resume analyzer and professional career coach.

Analyze the uploaded resume carefully.

Job Title:
${jobTitle || "Not provided"}

Job Description:
${jobDescription || "Not provided"}

Evaluate the resume based on these five categories:

1. ATS
2. Tone and Style
3. Content
4. Structure
5. Skills

For EVERY category:

- Give a realistic score from 0 to 100.
- Do not use 0 unless the category is genuinely missing or unusable.
- Give 3 to 4 useful tips.
- Each tip must be specific to the uploaded resume.
- Do not give generic advice.
- Consider the job title and job description when available.

Overall score must also be between 0 and 100.

IMPORTANT:
The scores must reflect the actual quality of the uploaded resume.
Do not automatically give 0 scores.
Do not leave any category incomplete.

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.
Do not add explanations outside JSON.
Do not write "Here is the analysis".
Do not include comments.

Use EXACTLY this JSON structure:

${AIResponseFormat}
`;
