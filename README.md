# AI Resume Critic

A modern web app that analyzes and critiques resumes using Groq's LLaMA-3-8B model. Upload your PDF resume and receive instant, AI-powered feedback or generate personalized cover letters that highlight your matching skills.

## Features

- Upload your resume as a PDF
- Extracts and previews resume text
- Analyzes your resume using Groq's LLaMA-3-8B model
- Provides actionable feedback for improvement
- Generates personalized cover letters based on job descriptions
- Download generated cover letters as PDF files
- Responsive design that works on both desktop and mobile devices
- Modern UI with intuitive navigation

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Groq API Key](https://console.groq.com/keys) for accessing LLaMA-3-8B model
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

### Key Dependencies

- [Next.js](https://nextjs.org/) - React framework
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) - PDF text extraction
- [html2pdf.js](https://www.npmjs.com/package/html2pdf.js) - PDF generation
- [lucide-react](https://lucide.dev/) - Icons
- [openai](https://www.npmjs.com/package/openai) - OpenAI API client (used with Groq's API)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yop-dev/ai-resume-critic.git
   cd ai-resume-critic
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory with:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run the development server:**

   ```sh
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

### Deployment on Vercel

1. **Fork or clone this repository to your GitHub account**

2. **Sign up for a [Vercel](https://vercel.com) account**

3. **Create a new project in Vercel and import your GitHub repository**

4. **Add environment variables:**
   - Add `GROQ_API_KEY` with your Groq API key
   
   > **Note:** Groq offers free access to the LLaMA-3-8B model.

5. **Deploy the application**
   - Vercel will automatically build and deploy your application
   - You'll receive a URL for your deployed application

## Project Structure

- `pages/` - Next.js API routes and page components
  - `index.js` - Main application page with tabs for resume critique and cover letter generation
  - `api/` - Backend API endpoints
    - `upload.js` - PDF text extraction
    - `analyze.js` - Resume analysis
    - `generate-cover-letter.js` - Cover letter generation
- `components/` - Reusable React components
  - `ResumePanel.js` - Resume text display and analysis
  - `CoverLetterGenerator.js` - Cover letter generation with PDF download capability
- `styles/global.css` - Global styles and animations

## API Endpoints

- `POST /api/upload`  
  Accepts a base64 PDF, extracts text using `pdf-parse`.

- `POST /api/analyze`  
  Sends resume text to Groq's LLaMA-3-8B model for analysis and returns feedback.

- `POST /api/generate-cover-letter`  
  Generates a personalized cover letter based on the resume and job description using Groq's LLaMA-3-8B model.

## Customization

- Update the prompt in `pages/api/analyze.js` to tailor feedback style.
- Modify the cover letter generation prompt in `pages/api/generate-cover-letter.js`.
- Adjust UI in `components/ResumePanel.js`, `components/CoverLetterGenerator.js`, and `pages/index.js` as needed.
- Customize the PDF format in the `downloadAsPdf` function in `components/CoverLetterGenerator.js`.

## Creator

This project was created by [Joner De Silva](https://www.linkedin.com/in/joner-de-silva-861575203/).

## License

MIT

---

**Powered by [Groq](https://groq.com/) and [LLaMA-3-8B](https://groq.com/models/llama3-8b-8192).**
