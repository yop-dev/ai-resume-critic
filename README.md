# AI Resume Critic

A modern web app that analyzes and critiques resumes using the Ollama Mistral LLM. Upload your PDF resume and receive instant, AI-powered feedback or generate personalized cover letters that highlight your matching skills.

## Features

- Upload your resume as a PDF
- Extracts and previews resume text
- Analyzes your resume using Ollama Mistral
- Provides actionable feedback for improvement
- Generates personalized cover letters based on job descriptions
- Highlights skills that match the job requirements
- Modern, responsive UI built with React and Tailwind CSS

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Ollama](https://ollama.com/) running locally with the `mistral` model
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

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

3. **Start Ollama with the Mistral model:**

   ```sh
   ollama run mistral
   ```

4. **Run the development server:**

   ```sh
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Project Structure

- `pages/` - Next.js API routes and page components
  - `index.js` - Main application page with tabs for resume critique and cover letter generation
  - `api/` - Backend API endpoints
    - `upload.js` - PDF text extraction
    - `analyze.js` - Resume analysis
    - `generate-cover-letter.js` - Cover letter generation
- `components/` - Reusable React components
  - `ResumePanel.js` - Resume text display and analysis
  - `CoverLetterGenerator.js` - Cover letter generation interface
- `styles/global.css` - Tailwind CSS and custom styles

## API Endpoints

- `POST /api/upload`  
  Accepts a base64 PDF, extracts text using `pdf-parse`.

- `POST /api/analyze`  
  Sends resume text to Ollama Mistral for analysis and returns feedback.

- `POST /api/generate-cover-letter`  
  Generates a personalized cover letter based on the resume and job description.

## Customization

- Update the prompt in `pages/api/analyze.js` to tailor feedback style.
- Modify the cover letter generation prompt in `pages/api/generate-cover-letter.js`.
- Adjust UI in `components/ResumePanel.js`, `components/CoverLetterGenerator.js`, and `pages/index.js` as needed.

## License

MIT

---

**Powered by [Ollama](https://ollama.com/) and [Mistral](https://mistral.ai/).**
