# TheraBot

TheraBot is an empathetic AI assistant powered by the Claude API. It provides supportive conversations through a clean, user-friendly interface.

## Features

- Real-time chat interface
- Dark/light mode
- Customizable system prompt
- Mobile-responsive design

## Created By

- Pratham Pattnaik
- Rong Yiran
- Ezekiel Ong

## Technologies Used

- React
- Express
- Claude API
- GitHub Pages

## Setup Instructions

### Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your Anthropic API key:
   ```
   PORT=3005
   ANTHROPIC_API_KEY=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

```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser to `http://localhost:3000` or the port shown in your terminal

### Deployment

#### Frontend (GitHub Pages)

1. Update the `homepage` field in `package.json` with your GitHub username:
   ```json
   "homepage": "https://yourusername.github.io/therabot"
   ```

2. Install the gh-pages package if not already installed:
   ```
   npm install --save-dev gh-pages
   ```

3. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```

4. Configure GitHub repository settings:
   - Go to Repository > Settings > Pages
   - Select the `gh-pages` branch as the source
   - Save changes

#### Backend (Render, Heroku, or other hosting)

1. Create an account on your preferred hosting platform (Render, Heroku, etc.)
2. Connect your GitHub repository
3. Configure environment variables:
   - `PORT`: The port for your server (often assigned automatically)
   - `ANTHROPIC_API_KEY`: Your Claude API key
4. Deploy the server
5. Update the `API_URL` in `App.js` with your backend URL:
   ```javascript
   const API_URL = process.env.NODE_ENV === 'production' 
     ? 'https://your-backend-url.com/api/chat'
     : 'http://localhost:3005/api/chat';
   ```
6. Redeploy the frontend: `npm run deploy`

## Usage

1. Visit your deployed site or local development server
2. Start chatting with TheraBot
3. Use the settings panel to customize the system prompt
4. Toggle between light and dark mode

## License

This project is licensed under the MIT License

## Acknowledgements

- Anthropic for the Claude API
- React Icons for the icon library
- React Markdown for rendering markdown content