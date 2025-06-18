# AI Resume Critic

A modern web app that analyzes and critiques resumes using the Ollama Mistral LLM. Upload your PDF resume and receive instant, AI-powered feedback.

## Features

- Upload your resume as a PDF
- Extracts and previews resume text
- Analyzes your resume using Ollama Mistral
- Provides actionable feedback for improvement
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
- `components/` - Reusable React components
- `styles/global.css` - Tailwind CSS and custom styles

## API Endpoints

- `POST /api/upload`  
  Accepts a base64 PDF, extracts text using `pdf-parse`.

- `POST /api/analyze`  
  Sends resume text to Ollama Mistral for analysis and returns feedback.

## Customization

- Update the prompt in `pages/api/analyze.js` to tailor feedback style.
- Adjust UI in `components/ResumePanel.js` and `pages/index.js` as needed.

## License

MIT

---

**Powered by [Ollama](https://ollama.com/) and [Mistral](https://mistral.ai/).**
